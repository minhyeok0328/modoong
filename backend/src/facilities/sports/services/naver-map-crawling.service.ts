import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as puppeteer from 'puppeteer';
import { BASE_LAT, BASE_LNG } from '../../../common/utils/geocoding.util';

interface FacilityData {
  imageSrc: string;
  streetViewUrl: string;
  streetViewPreview: string;
  amenities: string[];
}

@Injectable()
export class NaverMapCrawlingService {
  private readonly logger = new Logger(NaverMapCrawlingService.name);

  constructor(private prisma: PrismaService) {}

  async crawlAllFacilities(): Promise<{
    success: number;
    total: number;
    errors: string[];
  }> {
    const startTime = Date.now();
    this.logger.log('네이버 지도 크롤링 시작');

    // 기준 위치 (사용자 요청 위치)
    const baseLat = BASE_LAT;
    const baseLng = BASE_LNG;

    // 기준 위치에서 가까운 순으로 체육시설 가져오기 (데이터베이스 레벨에서 거리 계산 및 정렬)
    const facilities = await this.prisma.$queryRaw`
      SELECT
        id,
        "si_desc",
        "refine_wgs84_lat",
        "refine_wgs84_logt",
        ST_Distance(
          ST_Point(${baseLng}, ${baseLat})::geography,
          ST_Point("refine_wgs84_logt", "refine_wgs84_lat")::geography
        ) as distance
      FROM "sports_facilities"
      WHERE "refine_wgs84_lat" IS NOT NULL
        AND "refine_wgs84_logt" IS NOT NULL
      ORDER BY distance
    `;

    const sortedFacilities = facilities as Array<{
      id: string;
      si_desc: string;
      refine_wgs84_lat: number;
      refine_wgs84_logt: number;
      distance: number;
    }>;

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < sortedFacilities.length; i++) {
      const facility = sortedFacilities[i];
      this.logger.log(
        `크롤링 진행 중... (${i + 1}/${sortedFacilities.length}): ${facility.si_desc}`,
      );

      if (!facility.si_desc) {
        this.logger.warn(`체육시설 이름이 없습니다: ${facility.id}`);
        continue;
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--allow-running-insecure-content',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
        protocolTimeout: 300000, // 5분으로 증가 (필요에 따라 조정)
      });

      try {
        const facilityData = await this.crawlFacility(
          browser,
          facility.si_desc,
        );

        // 데이터베이스에 저장
        await this.prisma.sportsFacility.update({
          where: { id: facility.id },
          data: {
            imageSrc: facilityData.imageSrc,
            streetViewUrl: facilityData.streetViewUrl,
            streetViewPreview: facilityData.streetViewPreview,
            amenities: facilityData.amenities,
          },
        });

        successCount++;
        this.logger.log(`크롤링 성공: ${facility.si_desc}`);
        await this.sleep(5000);
      } catch (error) {
        const errorMessage = `크롤링 실패: ${facility.si_desc} - ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
        this.logger.error(errorMessage);
        errors.push(errorMessage);

        // 에러 발생 시 더 긴 대기
        await this.sleep(2000);
      } finally {
        await browser.close();
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    this.logger.log(
      `크롤링 완료 - 성공: ${successCount}/${sortedFacilities.length}, 소요시간: ${duration}초`,
    );

    return {
      success: successCount,
      total: sortedFacilities.length,
      errors,
    };
  }

  private async crawlFacility(
    browser: puppeteer.Browser,
    facilityName: string,
  ): Promise<FacilityData> {
    const page = await browser.newPage();

    try {
      // 네이버 지도 검색
      const searchUrl = `https://map.naver.com/p/search/${encodeURIComponent(facilityName)}?c=15.00,0,0,0,dh`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // 페이지 로딩 대기
      await this.sleep(5000);

      // 2가지 경우 처리
      let facilityKey: string;

      // 현재 URL 확인
      const currentUrl = page.url();
      const placeMatch = currentUrl.match(/\/place\/(\d+)/);

      if (placeMatch) {
        // 2-1: 바로 리다이렉트된 경우
        facilityKey = placeMatch[1];
      } else {
        // 2-2: 여러 결과가 나온 경우
        // searchIframe이 로드될 때까지 대기
        await page.waitForSelector('#searchIframe', { timeout: 10000 });

        // iframe 핸들 가져오기
        const searchFrameHandle = await page.$('#searchIframe');
        const searchFrame = await searchFrameHandle?.contentFrame();

        if (!searchFrame) {
          throw new Error('검색 iframe을 찾을 수 없습니다');
        }

        // iframe 내부에서 검색 결과 대기 및 클릭
        await searchFrame.waitForSelector(
          '#_pcmap_list_scroll_container ul li a',
          { timeout: 10000 },
        );
        await searchFrame.click('#_pcmap_list_scroll_container ul li a');
        await this.sleep(2000);

        const newUrl = page.url();
        const newPlaceMatch = newUrl.match(/\/place\/(\d+)/);

        if (!newPlaceMatch) {
          throw new Error('체육시설 키를 찾을 수 없습니다');
        }

        facilityKey = newPlaceMatch[1];
      }

      // 체육시설 상세 페이지로 이동
      const detailUrl = `https://map.naver.com/p/search/${encodeURIComponent(facilityName)}/place/${facilityKey}?c=15.00,0,0,0,dh`;
      await page.goto(detailUrl, { waitUntil: 'networkidle2' });
      await this.sleep(2000);

      // iframe 대기
      await page.waitForSelector('#entryIframe', { timeout: 10000 });

      // iframe 내용 처리
      const facilityData = await page.evaluate(() => {
        const iframe = document.querySelector(
          '#entryIframe',
        ) as HTMLIFrameElement;
        if (!iframe) throw new Error('iframe을 찾을 수 없습니다');

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) throw new Error('iframe 내용에 접근할 수 없습니다');

        // 1. 체육시설 대표 이미지
        const imgElement = iframeDoc.querySelector(
          '#_autoPlayable img',
        ) as HTMLImageElement;
        const imageSrc = imgElement?.src || '';

        return {
          imageSrc,
          streetViewUrl: '',
          streetViewPreview: '',
          amenities: [] as string[],
        };
      });

      // 2. 거리뷰 URL 가져오기 및 미리보기 캡처
      try {
        const streetViewUrl = await this.getStreetViewUrl(page);
        facilityData.streetViewUrl = streetViewUrl;

        // 거리뷰 미리보기 캡처
        if (streetViewUrl) {
          const streetViewPreview =
            await this.captureStreetViewPreview(streetViewUrl);
          facilityData.streetViewPreview = streetViewPreview;
        }
      } catch (error) {
        this.logger.warn(
          `거리뷰 URL 가져오기 실패: ${facilityName} - ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        );
      }

      // 3. 편의시설 정보 가져오기
      try {
        const amenities = await this.getAmenities(page);
        facilityData.amenities = amenities;
      } catch (error) {
        this.logger.warn(
          `편의시설 정보 가져오기 실패: ${facilityName} - ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        );
      }

      return facilityData;
    } finally {
      await page.close();
    }
  }

  private async getStreetViewUrl(page: puppeteer.Page): Promise<string> {
    // iframe 내에서 거리뷰 버튼 클릭
    await page.evaluate(() => {
      const iframe = document.querySelector(
        '#entryIframe',
      ) as HTMLIFrameElement;
      if (!iframe) throw new Error('iframe을 찾을 수 없습니다');

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('iframe 내용에 접근할 수 없습니다');

      const loadViewButton = Array.from(iframeDoc.querySelectorAll('a')).find(
        (a) => a.querySelector('span')?.textContent === '거리뷰',
      );

      if (loadViewButton) {
        loadViewButton.click();
      } else {
        throw new Error('거리뷰 버튼을 찾을 수 없습니다');
      }
    });

    // URL 변경 대기
    await this.sleep(3000);

    const currentUrl = page.url();
    // &isMini=true 쿼리스트링 제거
    return currentUrl.replace(/&isMini=true/g, '');
  }

  private async getAmenities(page: puppeteer.Page): Promise<string[]> {
    // 상세정보 페이지로 이동
    await page.evaluate(() => {
      const iframe = document.querySelector(
        '#entryIframe',
      ) as HTMLIFrameElement;
      if (!iframe) throw new Error('iframe을 찾을 수 없습니다');

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('iframe 내용에 접근할 수 없습니다');

      const informationLink = iframeDoc.querySelector(
        'a[href^="/place/information"]',
      ) as HTMLAnchorElement;
      if (informationLink) {
        informationLink.click();
      } else {
        throw new Error('상세정보 링크를 찾을 수 없습니다');
      }
    });

    await this.sleep(3000);

    // 편의시설 정보 추출
    const amenities = await page.evaluate(() => {
      const iframe = document.querySelector(
        '#entryIframe',
      ) as HTMLIFrameElement;
      if (!iframe) throw new Error('iframe을 찾을 수 없습니다');

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('iframe 내용에 접근할 수 없습니다');

      const headers = Array.from(
        iframeDoc.querySelectorAll('h2.place_section_header'),
      );

      for (const h2 of headers) {
        const titleElement = h2.querySelector('div.place_section_header_title');
        if (titleElement?.textContent?.includes('편의시설')) {
          const amenityElements = h2.parentElement?.querySelectorAll(
            '.place_section_content li',
          );
          if (amenityElements) {
            return Array.from(amenityElements)
              .map((li) => li.querySelector('div')?.textContent)
              .filter(Boolean) as string[];
          }
        }
      }

      return [];
    });

    return amenities;
  }

  private async captureStreetViewPreview(
    streetViewUrl: string,
  ): Promise<string> {
    const BROWSER_SIZE = [1600, 900];
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--allow-running-insecure-content',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--enable-webgl',
        '--enable-accelerated-2d-canvas',
        '--enable-gpu-rasterization',
        '--force-gpu-mem-available-mb=1024',
        '--max_old_space_size=4096',
        `--window-size=${BROWSER_SIZE[0]},${BROWSER_SIZE[1]}`,
      ],
      protocolTimeout: 300000,
      defaultViewport: {
        width: BROWSER_SIZE[0],
        height: BROWSER_SIZE[1],
      },
    });

    try {
      const page = await browser.newPage();

      // 페이지 설정
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );
      await page.setViewport({
        width: BROWSER_SIZE[0],
        height: BROWSER_SIZE[1],
      });

      // JavaScript 활성화 및 이미지 로딩 허용
      await page.setJavaScriptEnabled(true);
      await page.setRequestInterception(false);

      // 거리뷰 페이지로 이동
      this.logger.log(`거리뷰 페이지로 이동: ${streetViewUrl}`);
      await page.goto(streetViewUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // 거리뷰 로딩 완료 대기
      await this.sleep(10000);

      // 불필요한 UI 요소들 제거
      await this.removeUnnecessaryUIElements(page);

      // 페이지 스크린샷 캡처
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        encoding: 'base64',
      });

      await page.close();
      return `data:image/png;base64,${screenshot}`;
    } catch (error) {
      this.logger.error(
        `거리뷰 미리보기 캡처 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
      return '';
    } finally {
      await browser.close();
    }
  }

  private async removeUnnecessaryUIElements(
    page: puppeteer.Page,
  ): Promise<void> {
    try {
      await page.evaluate(() => {
        // 미니맵 제거
        const miniMap = document.querySelector('[class^="StyledMiniMap"]');
        if (miniMap) {
          miniMap.remove();
        }

        // 파노라마 위치 정보 제거
        const panoramaLocationInfo = document.querySelector(
          '[class^="StyledPanoramaLocationInfo"]',
        );
        if (panoramaLocationInfo) {
          panoramaLocationInfo.remove();
        }

        // 뷰어 컨트롤 제거
        const viewerControl = document.querySelector(
          '[class^="StyledViewerControl"]',
        );
        if (viewerControl) {
          viewerControl.remove();
        }

        // 파노라마 컨트롤 제거
        const panoramaControl = document.querySelector(
          '[class^="StyledPanoramaControl"]',
        );
        if (panoramaControl) {
          panoramaControl.remove();
        }

        // 모든 다이얼로그 제거
        const dialogs = document.querySelectorAll('dialog');
        dialogs.forEach((dialog) => {
          dialog.remove();
        });
      });

      this.logger.log('불필요한 UI 요소들 제거 완료');
    } catch (error) {
      this.logger.warn(
        `UI 요소 제거 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
