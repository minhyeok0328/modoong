import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApiResponse, RehabFacilityData } from '../types/api.types';
import { parseCoordinates } from '../../sports/utils/coordinate.util';
import { sleep } from '../../../common/utils/async.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class RehabFacilitiesApiService {
  private readonly logger = new Logger(RehabFacilitiesApiService.name);
  private readonly API_URL = 'https://openapi.gg.go.kr/Ggdspsnphstrnfaclt';
  private readonly PAGE_SIZE = 999;

  constructor(private readonly configService: ConfigService) {}

  async fetchAllRehabFacilities(): Promise<RehabFacilityData[]> {
    let allFacilities: RehabFacilityData[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await axios.get<ApiResponse>(this.API_URL, {
          params: {
            KEY: this.configService.get<string>('GG_API_KEY'),
            Type: 'json',
            pSize: this.PAGE_SIZE,
            pIndex: page,
          },
        });

        const data = response.data.Ggdspsnphstrnfaclt;
        if (data && data.length > 1) {
          const totalCount = data[0].head[0].list_total_count;
          const facilities = data[1].row ?? [];
          allFacilities = allFacilities.concat(facilities);

          if (allFacilities.length >= totalCount) {
            hasMore = false;
          } else {
            page++;
            await sleep(50); // Add a small delay to avoid overwhelming the API
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        this.logger.error(
          `Failed to fetch rehab facilities data: ${error.message}`,
          error.stack,
        );
        hasMore = false;
      }
    }
    return allFacilities;
  }

  mapApiDataToSchema(
    apiData: RehabFacilityData,
  ): Prisma.RehabFacilityCreateInput {
    const { latitude, longitude } = parseCoordinates(
      apiData.REFINE_WGS84_LAT,
      apiData.REFINE_WGS84_LOGT,
    );

    return {
      sigunCd: apiData.SIGUN_CD,
      sigunNm: apiData.SIGUN_NM,
      instNm: apiData.INST_NM,
      telno: apiData.TELNO || null,
      hmpgUrl: apiData.HMPG_URL || null,
      instlStatmntDe: apiData.INSTL_STATMNT_DE || null,
      refineLotnoAddr: apiData.REFINE_LOTNO_ADDR || null,
      refineRoadnmAddr: apiData.REFINE_ROADNM_ADDR || null,
      refineZipCd: apiData.REFINE_ZIP_CD || null,
      refineWgs84Lat: latitude || 0,
      refineWgs84Logt: longitude || 0,
    };
  }
}
