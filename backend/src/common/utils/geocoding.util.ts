import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export async function convertAddressToCoordinates(
  address: string,
  configService: ConfigService,
): Promise<[number, number] | null> {
  try {
    const KAKAO_MAP_API_KEY = configService.get<string>('KAKAO_MAP_API_KEY');
    if (!KAKAO_MAP_API_KEY) {
      throw new Error('KAKAO_MAP_API_KEY is not configured');
    }

    const response = await axios.get<{
      documents: Array<{
        address: { x: string; y: string };
      }>;
    }>(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleanAddressForGeocoding(address))}}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_MAP_API_KEY}`,
        },
      },
    );

    if (response.data.documents.length > 0) {
      const { x, y } = response.data.documents[0].address;
      return [parseFloat(y), parseFloat(x)]; // [latitude, longitude]
    }
    return null;
  } catch (error) {
    console.error('Error converting address to coordinates:', error);
    return null;
  }
}

export function cleanAddressForGeocoding(address: string): string {
  if (!address || typeof address !== 'string') {
    return address;
  }

  try {
    // 입력 주소 정규화
    const normalizedAddress = address.replace(/\s+/g, ' ').trim();

    // 도로명 + 건물번호 패턴 매칭
    const roadPattern = /([가-힣]+(로|길)(?:\d+번길)?)\s+(\d+(?:-\d+)?)/;
    const match = normalizedAddress.match(roadPattern);

    if (match) {
      const roadName = match[1];
      const buildingNumber = match[3];
      const startPos = normalizedAddress.indexOf(roadName);
      const prefix = normalizedAddress.substring(0, startPos);

      return `${prefix}${roadName} ${buildingNumber}`.trim();
    } else {
      // 패턴 매칭 실패 시 폴백 방식
      const fallbackPatterns = [
        /\s+\d+[,~-]\d*층/g, // 층수
        /\s+\d+[,~-]?\d*호/g, // 호수
        /\s+[가-힣]+센터[^(]*\([^)]+\)/g, // 업체명
        /\([가-힣]+동\)$/g, // 동명
        /\s+[가-힣]+\([^)]+\)$/g, // 기타 괄호 정보
      ];

      let result = normalizedAddress;
      fallbackPatterns.forEach((pattern) => {
        result = result.replace(pattern, '');
      });

      return result.trim();
    }
  } catch {
    console.warn(`주소 정제 실패: ${address}, 원본 주소 사용`);
    return address;
  }
}

export const BASE_LAT = 37.2413052297472;
export const BASE_LNG = 127.071756095713;
