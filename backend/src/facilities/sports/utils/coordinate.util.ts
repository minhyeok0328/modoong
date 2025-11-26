import { Logger } from '@nestjs/common';

export interface CoordinateData {
  location?: { type: 'Point'; coordinates: [number, number] };
  latitude?: number;
  longitude?: number;
}

/**
 * 위도경도 문자열을 파싱하여 GeoJSON Point와 숫자형 좌표로 변환
 */
export function parseCoordinates(
  latStr: string,
  lngStr: string,
): CoordinateData {
  const logger = new Logger('CoordinateUtil');

  try {
    if (!latStr || !lngStr || latStr.trim() === '' || lngStr.trim() === '') {
      return {};
    }

    const lat = parseFloat(latStr.trim());
    const lng = parseFloat(lngStr.trim());

    if (isNaN(lat) || isNaN(lng)) {
      return {};
    }

    if (lat === 0 && lng === 0) {
      return {};
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      logger.debug(`전세계 범위를 벗어난 좌표: lat=${lat}, lng=${lng}`);
      return {};
    }

    return {
      location: {
        type: 'Point',
        coordinates: [lng, lat], // GeoJSON은 [경도, 위도] 순서
      },
      latitude: lat,
      longitude: lng,
    };
  } catch {
    logger.debug(`좌표 파싱 실패: lat=${latStr}, lng=${lngStr}`);
    return {};
  }
}
