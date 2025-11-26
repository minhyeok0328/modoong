import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { convertAddressToCoordinates } from '../../../common/utils/geocoding.util';
import { convertImageToBase64 } from '../../../common/utils/convert.image.base64';
import { sleep } from '../../../common/utils/async.util';

interface FacilityBasicInfo {
  bizrno: string;
  facilityName: string;
  facilityImageUrl: string;
}

interface FacilityDetailInfo {
  facilityName: string;
  facilityOwner: string;
  facilityPhone: string;
  facilityAddress: string;
  vehicleSupport: string;
  disabilitySupport: string;
  courseInfo: object[];
}

@Injectable()
export class KspoVoucherCrawlingService {
  private readonly logger = new Logger(KspoVoucherCrawlingService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async crawlAllFacilities(): Promise<{
    success: number;
    total: number;
    errors: string[];
  }> {
    const startTime = Date.now();
    this.logger.log('KSPO 장애인스포츠강좌이용권 시설 크롤링 시작');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      // 초기 페이지 로드
      await page.goto(
        'https://dvoucher.kspo.or.kr/course/memberFacilityList.do',
        {
          waitUntil: 'networkidle2',
        },
      );

      // 시설 목록 가져오기
      const facilities = await this.getFacilitiesList(page);
      this.logger.log(`찾은 시설 수: ${facilities.length}`);

      let successCount = 0;
      const errors: string[] = [];

      for (const facility of facilities) {
        try {
          const detailInfo = await this.getFacilityDetail(
            page,
            facility.bizrno,
          );
          await this.saveFacilityData(facility.bizrno, {
            ...detailInfo,
            facilityImageUrl: facility.facilityImageUrl,
          });
          successCount++;
          this.logger.log(`시설 저장 완료: ${detailInfo.facilityName}`);
          await sleep(10000);
        } catch (error) {
          const errorMsg = `시설 ${facility.facilityName} 처리 실패: ${error.message}`;
          this.logger.error(errorMsg);
          errors.push(errorMsg);
        }
      }

      const endTime = Date.now();
      this.logger.log(
        `크롤링 완료 - 성공: ${successCount}/${facilities.length}, 소요시간: ${(endTime - startTime) / 1000}초`,
      );

      return {
        success: successCount,
        total: facilities.length,
        errors,
      };
    } finally {
      await browser.close();
    }
  }

  private async getFacilitiesList(
    page: puppeteer.Page,
  ): Promise<FacilityBasicInfo[]> {
    // AJAX 요청으로 시설 목록 가져오기
    const response = await page.evaluate(async () => {
      const formData = new URLSearchParams();
      formData.append('pageLimit', '98');
      formData.append('pageNo', '1');
      formData.append('brtcCd', '41');
      formData.append('signguCd', '41130');
      formData.append('availableCd', 'Y');

      const response = await fetch('/course/memberFacilityListAjax.do', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formData,
      });

      return await response.text();
    });

    // 받은 HTML을 페이지에 삽입
    await page.evaluate((html) => {
      const dvList = document.querySelector('div#dvList');
      if (dvList) {
        dvList.innerHTML = html;
      }
    }, response);

    // 시설 목록 추출
    const facilities = await page.evaluate(() => {
      const $facilityList = document.querySelectorAll(
        '.fac-list-container ul li',
      );
      return [...$facilityList]
        .map(($items) => {
          const $link = $items.querySelector('a');
          const facilityImageUrl =
            $items.querySelector('img')?.getAttribute('src') || '';
          const href = $link?.getAttribute('href');
          const facilityName = $link?.textContent?.trim() || '';

          // href에서 bizrno 추출 (예: "javascript:fn_goCourse('7141401594','1');")
          const match = href?.match(/fn_goCourse\('([^']+)'/);
          const bizrno = match ? match[1] : '';

          return {
            bizrno,
            facilityName,
            facilityImageUrl,
          };
        })
        .filter((f) => f.bizrno);
    });

    return facilities;
  }

  private async getFacilityDetail(
    page: puppeteer.Page,
    bizrno: string,
  ): Promise<FacilityDetailInfo> {
    // 새 페이지에서 직접 POST 요청으로 상세 페이지 이동
    const detailPage = await page.browser().newPage();

    try {
      // POST 요청을 통해 상세 페이지로 이동
      await detailPage.goto(
        'https://dvoucher.kspo.or.kr/course/memberFacilityCourseList.do',
        {
          waitUntil: 'networkidle2',
        },
      );

      // 폼 데이터를 설정하고 POST 요청 수행
      await detailPage.evaluate(async (bizrno) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/course/memberFacilityCourseList.do';

        const fields = [
          { name: 'listUrl', value: '/course/memberFacilityListJsonView.do' },
          { name: 'detailUrl', value: '/course/memberFacilityCourseList.do' },
          { name: 'bizrno', value: bizrno },
          { name: 'alsfcSn', value: '1' },
          { name: 'pageNo', value: '1' },
          { name: 'pageLimit', value: '3' },
          { name: 'brtcCd', value: '41' },
          { name: 'signguCd', value: '41130' },
          { name: 'altnCd', value: 'ALL' },
          { name: 'availableCd', value: 'Y' },
          { name: 'provideInfoAgreAt', value: 'Y' },
        ];

        fields.forEach((field) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = field.name;
          input.value = field.value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }, bizrno);

      // 페이지 로딩 대기 - 네트워크가 안정될 때까지 대기
      await detailPage.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 10000,
      });

      // 특정 요소가 로드될 때까지 대기
      await detailPage.waitForSelector('.fac-det-info', { timeout: 10000 });
    } catch (error) {
      this.logger.warn(
        `페이지 로딩 타임아웃 또는 실패: ${bizrno}, 계속 진행...`,
      );
    }

    const facilityData = await detailPage.evaluate(() => {
      // 시설 기본 정보
      const facilityName =
        [...document.querySelectorAll('.fac-det-info dl dt span')]
          .pop()
          ?.textContent?.trim() || '';
      const facilityInfos = [
        ...document.querySelectorAll('.fac-det-info dl dd'),
      ];
      const facilityOwner =
        facilityInfos[0]?.textContent?.split(':')?.pop()?.trim() || '';
      const facilityPhone =
        facilityInfos[1]?.textContent?.split(':')?.pop()?.trim() || '';
      const facilityAddress =
        facilityInfos[2]?.textContent?.split(':')?.pop()?.trim() || '';

      // 차량지원, 장애지원시설 정보
      const table = document.querySelector('.support-table');
      const supportInfo: Record<string, string> = {};

      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
          const key = row.querySelector('th')?.textContent?.trim();
          const td = row.querySelector('td');

          if (key && td) {
            const spans = td.querySelectorAll('span');
            const values = Array.from(spans)
              .map((span) => span.textContent?.trim())
              .filter(Boolean);
            supportInfo[key] = values.join(', ');
          }
        });
      }

      const vehicleSupport = Object.values(supportInfo)[0] || '';
      const disabilitySupport = Object.values(supportInfo)[1] || '';

      // 강좌 정보
      const courseInfo: object[] = [];
      document.querySelectorAll('.class_box').forEach(($class) => {
        const tags = [...$class.querySelectorAll('dt em')].map((item) =>
          item.textContent?.trim(),
        );
        const title =
          $class.querySelector('dt span')?.textContent?.trim() || '';
        const info = [...$class.querySelectorAll('dd ol li')].map((item) => ({
          [item.querySelector('em')?.textContent?.trim() || '']:
            item.querySelector('p')?.textContent?.trim() || '',
        }));
        const price = $class.querySelector('strong')?.textContent?.trim() || '';
        const description =
          $class.querySelector('.class-box-bottom li')?.textContent?.trim() ||
          '';

        courseInfo.push({
          tags,
          title,
          info,
          price,
          description,
        });
      });

      return {
        facilityName,
        facilityOwner,
        facilityPhone,
        facilityAddress,
        vehicleSupport,
        disabilitySupport,
        courseInfo,
      };
    });

    await detailPage.close();
    return facilityData;
  }

  private async saveFacilityData(
    bizrno: string,
    detailInfo: FacilityDetailInfo & {
      facilityImageUrl: FacilityBasicInfo['facilityImageUrl'];
    },
  ): Promise<void> {
    // 좌표 변환
    const coordinates = await convertAddressToCoordinates(
      detailInfo.facilityAddress,
      this.configService,
    );

    // 이미지를 base64로 변환
    let facilityImageBase64: string | null = null;
    if (detailInfo.facilityImageUrl) {
      const fullImageUrl = detailInfo.facilityImageUrl.startsWith('http')
        ? detailInfo.facilityImageUrl
        : `https://dvoucher.kspo.or.kr${detailInfo.facilityImageUrl}`;
      facilityImageBase64 = await convertImageToBase64(fullImageUrl);
    }

    // 데이터베이스에 저장
    await this.prisma.disabilitySportsFacility.upsert({
      where: { bizrno },
      update: {
        facilityName: detailInfo.facilityName,
        facilityOwner: detailInfo.facilityOwner,
        facilityPhone: detailInfo.facilityPhone,
        facilityAddress: detailInfo.facilityAddress,
        latitude: coordinates ? coordinates[0] : null,
        longitude: coordinates ? coordinates[1] : null,
        vehicleSupport: detailInfo.vehicleSupport,
        disabilitySupport: detailInfo.disabilitySupport,
        facilityImageBase64,
        courseInfo: detailInfo.courseInfo,
        updatedAt: new Date(),
      },
      create: {
        bizrno,
        facilityName: detailInfo.facilityName,
        facilityOwner: detailInfo.facilityOwner,
        facilityPhone: detailInfo.facilityPhone,
        facilityAddress: detailInfo.facilityAddress,
        latitude: coordinates ? coordinates[0] : null,
        longitude: coordinates ? coordinates[1] : null,
        vehicleSupport: detailInfo.vehicleSupport,
        disabilitySupport: detailInfo.disabilitySupport,
        facilityImageBase64,
        courseInfo: detailInfo.courseInfo,
      },
    });
  }
}
