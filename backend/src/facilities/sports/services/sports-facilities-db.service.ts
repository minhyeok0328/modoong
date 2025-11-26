import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SportsFacilityData } from '../types/api.types';
import { Prisma, SportsFacility } from '@prisma/client';
import { BASE_LAT, BASE_LNG } from '../../../common/utils/geocoding.util';

@Injectable()
export class SportsFacilitiesDbService {
  private readonly logger = new Logger(SportsFacilitiesDbService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findLatest100ByCreateDate(): Promise<SportsFacility[]> {
    return this.prisma.sportsFacility.findMany({
      orderBy: {
        registDtm: 'desc',
      },
      take: 100,
    });
  }

  async findById(id: string): Promise<SportsFacility | null> {
    const facility = await this.prisma.sportsFacility.findUnique({
      where: { id },
    });

    if (!facility) {
      return null;
    }

    // disability_sports_facilities 테이블과 조인하여 관련 데이터 확인
    const disabilityFacilities = await this.prisma.$queryRawUnsafe(
      `
      SELECT dsf.*
      FROM disability_sports_facilities dsf
      WHERE dsf.facility_name = $1
      OR (dsf.latitude = $2 AND dsf.longitude = $3)
      OR dsf.facility_address = $4
    `,
      facility.siDesc,
      facility.refineWgs84Lat,
      facility.refineWgs84Logt,
      facility.refineRoadnmAddr,
    );

    // 결과 변환
    const snakeToCamel = (s: string) =>
      s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

    const transformedDisabilityFacilities = (disabilityFacilities as any[]).map(
      (dsf) => {
        const transformed: any = {};
        Object.keys(dsf).forEach((key) => {
          transformed[snakeToCamel(key)] = dsf[key];
        });
        return transformed;
      },
    );

    return {
      ...facility,
      disabilitySportsFacility:
        transformedDisabilityFacilities.length > 0
          ? transformedDisabilityFacilities[0]
          : null,
    } as SportsFacility;
  }

  async findNearbyFacilities(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000,
    limit: number = 20,
    facilityType?: string,
  ): Promise<SportsFacility[]> {
    const query = `
      SELECT * FROM (
        SELECT *, ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( refine_wgs84_lat ) ) * cos( radians( refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( refine_wgs84_lat ) ) ) ) AS distance
        FROM sports_facilities
      ) sub
      WHERE distance <= ${maxDistance / 1000}
      ${facilityType ? `AND faclt_type_nm = '${facilityType}'` : ''}
      ORDER BY distance
      LIMIT ${limit};
    `;
    return this.prisma.$queryRawUnsafe(query);
  }

  async findFacilitiesByRegion(
    sidoName: string,
    signguName?: string,
    facilityType?: string,
    limit: number = 50,
  ): Promise<SportsFacility[]> {
    return this.prisma.sportsFacility.findMany({
      where: {
        sidoNm: sidoName,
        signguNm: signguName,
        facltTypeNm: facilityType,
        facltStateNm: {
          not: '폐업',
        },
      },
      take: limit,
      orderBy: {
        siDesc: 'asc',
      },
    });
  }

  async findNearbyFacilitiesWithDistance(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000,
    limit: number = 20,
  ): Promise<Array<SportsFacility & { distance?: number }>> {
    const query = `
      SELECT *, ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( refine_wgs84_lat ) ) * cos( radians( refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( refine_wgs84_lat ) ) ) ) AS distance
      FROM sports_facilities
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( refine_wgs84_lat ) ) * cos( radians( refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( refine_wgs84_lat ) ) ) ) <= ${maxDistance / 1000}
      ORDER BY distance
      LIMIT ${limit};
    `;
    const results: Array<SportsFacility & { distance?: number }> =
      await this.prisma.$queryRawUnsafe(query);
    return results.map((r) => ({ ...r, distance: (r.distance || 0) * 1000 }));
  }

  async findNearbyFacilitiesWithPagination(
    latitude: number,
    longitude: number,
    skip: number = 0,
    take: number = 20,
    facilityType?: string,
    filter?: string,
    maxDistance?: number,
    amenities?: string[],
  ): Promise<{
    facilities: Array<SportsFacility & { distance?: number }>;
    totalCount: number;
  }> {
    const facilityTypeCondition = facilityType
      ? `AND sf.faclt_type_nm = '${facilityType}'`
      : '';

    const distanceCondition = maxDistance
      ? `AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( sf.refine_wgs84_lat ) ) * cos( radians( sf.refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( sf.refine_wgs84_lat ) ) ) ) <= ${maxDistance}`
      : '';

    // amenities 필터 조건 생성
    let amenitiesCondition = '';
    if (amenities && amenities.length > 0) {
      const amenitiesArray: string[] =
        typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

      amenitiesCondition = `AND (sf.amenities @> '${amenitiesArray}')`;
    }

    let baseQuery = '';
    let countQuery = '';

    if (filter === 'sports') {
      // filter=sports일 때: disability_sports_facilities와 조인되는 데이터만 반환
      baseQuery = `
        SELECT sf.*, dsf.facility_image_base64,
               ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( sf.refine_wgs84_lat ) ) * cos( radians( sf.refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( sf.refine_wgs84_lat ) ) ) ) AS distance
        FROM sports_facilities sf
        INNER JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE 1=1
        ${facilityTypeCondition}
        ${distanceCondition}
        ${amenitiesCondition}
      `;

      countQuery = `
        SELECT COUNT(*) as count
        FROM sports_facilities sf
        INNER JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE 1=1
        ${facilityTypeCondition}
        ${distanceCondition}
        ${amenitiesCondition}
      `;
    } else if (filter === 'others') {
      // filter=others일 때: faclt_opert_form_cd가 NULL이고 조인되지 않는 데이터만 반환
      baseQuery = `
        SELECT sf.*, dsf.facility_image_base64,
               ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( sf.refine_wgs84_lat ) ) * cos( radians( sf.refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( sf.refine_wgs84_lat ) ) ) ) AS distance
        FROM sports_facilities sf
        LEFT JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE dsf.id IS NULL
        AND sf.faclt_opert_form_cd IS NULL
        ${facilityTypeCondition}
        ${distanceCondition}
      `;

      countQuery = `
        SELECT COUNT(*) as count
        FROM sports_facilities sf
        LEFT JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE dsf.id IS NULL
        AND sf.faclt_opert_form_cd IS NULL
        ${facilityTypeCondition}
        ${distanceCondition}
      `;
    } else {
      // 다른 필터들 (disability, public, 기본값)
      let ownerCondition = '';
      switch (filter) {
        case 'disability':
          ownerCondition = "AND sf.posesn_mainbd_nm = '대한장애인체육회'";
          break;
        case 'public':
          ownerCondition =
            "AND sf.posesn_mainbd_nm IS NOT NULL AND sf.posesn_mainbd_nm != '대한장애인체육회'";
          break;
        default:
          ownerCondition = '';
      }

      baseQuery = `
        SELECT sf.*, dsf.facility_image_base64,
               ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( sf.refine_wgs84_lat ) ) * cos( radians( sf.refine_wgs84_logt ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( sf.refine_wgs84_lat ) ) ) ) AS distance
        FROM sports_facilities sf
        LEFT JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE 1=1
        ${facilityTypeCondition}
        ${ownerCondition}
        ${distanceCondition}
        ${amenitiesCondition}
      `;

      countQuery = `
        SELECT COUNT(*) as count
        FROM sports_facilities sf
        LEFT JOIN disability_sports_facilities dsf ON (
          dsf.facility_name = sf.si_desc
          OR (dsf.latitude = sf.refine_wgs84_lat AND dsf.longitude = sf.refine_wgs84_logt)
          OR dsf.facility_address = sf.refine_roadnm_addr
        )
        WHERE 1=1
        ${facilityTypeCondition}
        ${ownerCondition}
        ${distanceCondition}
        ${amenitiesCondition}
      `;
    }

    // 총 개수 조회
    const countResult: Array<{ count: bigint }> =
      await this.prisma.$queryRawUnsafe(countQuery);
    const totalCount = Number(countResult[0].count);

    // 페이징된 결과 조회
    const query = `${baseQuery} ORDER BY distance LIMIT ${take} OFFSET ${skip}`;
    const results: Array<
      SportsFacility & { distance?: number; facility_image_base64?: string }
    > = await this.prisma.$queryRawUnsafe(query);

    const snakeToCamel = (s: string) =>
      s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

    const facilities = results.map((r) => {
      const row = r as Record<string, any>;

      // 1) snake_case → camelCase 변환
      const camelCaseRow: Record<string, any> = {};
      Object.keys(row).forEach((k) => {
        camelCaseRow[snakeToCamel(k)] = row[k];
      });

      // 2) 추가 변환 및 기본값 처리
      return {
        ...camelCaseRow,
        distance: Number(
          ((row.distance as number | undefined) ?? 0).toFixed(2),
        ),
        refineWgs84Lat:
          row.refine_wgs84_lat ?? camelCaseRow.refineWgs84Lat ?? null,
        refineWgs84Logt:
          row.refine_wgs84_logt ?? camelCaseRow.refineWgs84Logt ?? null,
        imageSrc: row.image_src ?? camelCaseRow.imageSrc ?? null,
        streetViewUrl:
          row.street_view_url ?? camelCaseRow.streetViewUrl ?? null,
        streetViewPreview:
          row.street_view_preview ?? camelCaseRow.streetViewPreview ?? null,
        amenities: row.amenities ?? camelCaseRow.amenities ?? null,
        facilityImageBase64:
          row.facility_image_base64 ?? camelCaseRow.facilityImageBase64 ?? null,
        createdAt: row.created_at
          ? new Date(row.created_at)
          : (camelCaseRow.createdAt ?? new Date()),
        updatedAt: row.updated_at
          ? new Date(row.updated_at)
          : (camelCaseRow.updatedAt ?? new Date()),
      } as unknown as SportsFacility & { distance: number };
    });

    return {
      facilities,
      totalCount,
    };
  }

  async deleteAllSportsFacilities(): Promise<void> {
    await this.prisma.sportsFacility.deleteMany({});
  }

  async checkExistingFacilities(
    facltCdEncptVlList: string[],
  ): Promise<Set<string>> {
    const existingFacilities = await this.prisma.sportsFacility.findMany({
      where: {
        facltCdEncptVl: {
          in: facltCdEncptVlList,
        },
      },
      select: {
        facltCdEncptVl: true,
      },
    });

    return new Set(
      existingFacilities
        .map((facility) => facility.facltCdEncptVl)
        .filter((code): code is string => code !== null),
    );
  }

  async updateSportsFacilitiesData(
    data: SportsFacilityData[],
    mapDataFunction: (
      item: SportsFacilityData,
    ) => Prisma.SportsFacilityCreateInput,
  ): Promise<void> {
    if (data.length === 0) {
      this.logger.warn('업데이트할 데이터가 없습니다.');
      return;
    }

    try {
      await this.prisma.sportsFacility.deleteMany({});
      this.logger.log('기존 체육시설 데이터 삭제 완료');

      const mappedData = data.map(mapDataFunction);

      await this.prisma.sportsFacility.createMany({
        data: mappedData,
        skipDuplicates: true,
      });

      this.logger.log(`총 ${data.length}건의 체육시설 데이터 업데이트 완료`);
    } catch (error) {
      this.logger.error('데이터베이스 업데이트 실패', error);
      throw error;
    }
  }

  async insertSportsFacilitiesPage(
    data: SportsFacilityData[],
    mapDataFunction: (
      item: SportsFacilityData,
    ) => Prisma.SportsFacilityCreateInput,
  ): Promise<void> {
    if (data.length === 0) {
      this.logger.warn('삽입할 페이지 데이터가 없습니다.');
      return;
    }

    try {
      // 기존 데이터 중복 체크
      const facltCdEncptVlList = data
        .map(mapDataFunction)
        .map((item) => item.facltCdEncptVl)
        .filter((code): code is string => code !== null && code !== undefined);

      const existingCodes =
        await this.checkExistingFacilities(facltCdEncptVlList);

      // 중복되지 않은 데이터만 필터링
      const newData = data.filter((item) => {
        const mappedItem = mapDataFunction(item);
        return !existingCodes.has(mappedItem.facltCdEncptVl || '');
      });

      if (newData.length === 0) {
        this.logger.log(
          '삽입할 새로운 데이터가 없습니다. (모든 데이터가 이미 존재)',
        );
        return;
      }

      const mappedData = newData.map(mapDataFunction);
      await this.prisma.sportsFacility.createMany({
        data: mappedData,
      });

      this.logger.log(
        `총 ${data.length}건 중 ${newData.length}건의 새로운 체육시설 데이터 삽입 완료`,
      );
    } catch (error) {
      this.logger.error('페이지 데이터 삽입 실패', error);
      throw error;
    }
  }

  // distinct facility types - 반경 10km 내에서 가장 많은 타입 순으로 정렬
  async getAllFacilityTypes(): Promise<string[]> {
    const query = `
      SELECT faclt_type_nm, COUNT(*) as facility_count
      FROM (
        SELECT faclt_type_nm,
               ( 6371 * acos( cos( radians(${BASE_LAT}) ) * cos( radians( refine_wgs84_lat ) ) * cos( radians( refine_wgs84_logt ) - radians(${BASE_LNG}) ) + sin( radians(${BASE_LAT}) ) * sin( radians( refine_wgs84_lat ) ) ) ) AS distance
        FROM sports_facilities
        WHERE faclt_type_nm IS NOT NULL
          AND refine_wgs84_lat IS NOT NULL
          AND refine_wgs84_logt IS NOT NULL
      ) sub
      WHERE distance <= 10
      GROUP BY faclt_type_nm
      ORDER BY facility_count DESC
    `;
    const results: Array<{ faclt_type_nm: string }> =
      await this.prisma.$queryRawUnsafe(query);
    return results.map((r) => r.faclt_type_nm);
  }

  async getAllAmenityTypes(): Promise<string[]> {
    const facilities = await this.prisma.sportsFacility.findMany({
      where: {
        amenities: {
          not: Prisma.JsonNull,
        },
      },
      select: {
        amenities: true,
      },
      distinct: ['amenities'],
    });

    const amenitiesSet = new Set<string>();

    facilities.forEach((facility) => {
      if (facility.amenities && Array.isArray(facility.amenities)) {
        (facility.amenities as string[]).forEach((amenity: string) => {
          if (typeof amenity === 'string' && amenity.trim()) {
            amenitiesSet.add(amenity.trim());
          }
        });
      }
    });

    return [...amenitiesSet];
  }
}
