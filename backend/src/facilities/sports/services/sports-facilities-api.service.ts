import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ApiResponse, SportsFacilityData } from '../types/api.types';
import { parseCoordinates } from '../utils/coordinate.util';
import { sleep } from '../../../common/utils/async.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class SportsFacilitiesApiService {
  private readonly logger = new Logger(SportsFacilitiesApiService.name);
  private readonly API_URL = 'https://openapi.gg.go.kr/TBGGPHSTRNFACLTM';
  private readonly PAGE_SIZE = 999;

  constructor(private readonly configService: ConfigService) {}

  async fetchAllSportsFacilities(
    processPage: (data: SportsFacilityData[]) => Promise<void>,
  ): Promise<void> {
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

        const data = response.data.TBGGPHSTRNFACLTM;
        if (data && data.length > 1) {
          const totalCount = data[0].head[0].list_total_count;
          const facilities =
            data[1].row?.filter(
              (row) =>
                row.FACLT_STATE_NM === '정상운영' &&
                row.FACLT_TYPE_NM !== '간이운동장',
            ) ?? [];

          if (facilities.length > 0) {
            await processPage(facilities); // Process the current page
          }

          if (page * this.PAGE_SIZE >= totalCount) {
            hasMore = false;
          } else {
            page++;
            await sleep(50);
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        this.logger.error(
          `Failed to fetch sports facilities data: ${error instanceof Error ? error.message : String(error)}`,
          error instanceof Error ? error.stack : undefined,
        );
        hasMore = false;
      }
    }
  }

  mapApiDataToSchema(
    apiData: SportsFacilityData,
  ): Prisma.SportsFacilityCreateInput {
    const { latitude, longitude } = parseCoordinates(
      apiData.REFINE_WGS84_LAT,
      apiData.REFINE_WGS84_LOGT,
    );

    return {
      facltCdEncptVl: apiData.FACLT_CD_ENCPT_VL || null,
      refineWgs84Lat: latitude || 0,
      refineWgs84Logt: longitude || 0,
      facltDivNm: apiData.FACLT_DIV_NM || null,
      indutypeNm: apiData.INDUTYPE_NM || null,
      facltTypeNm: apiData.FACLT_TYPE_NM || null,
      facltTelno: apiData.FACLT_TELNO || null,
      sidoNm: apiData.SIDO_NM || null,
      signguNm: apiData.SIGNGU_NM || null,
      refineRoadnmAddr: apiData.REFINE_ROADNM_ADDR || null,
      siDesc: apiData.SI_DESC || null,
      facltStateNm: apiData.FACLT_STATE_NM || null,
      facltHmpgAddr: apiData.FACLT_HMPG_ADDR || null,
      facltOpertFormCd: apiData.FACLT_OPERT_FORM_CD || null,
      posesnMainbdNm: apiData.POSESN_MAINBD_NM || null,
      posesnMainbdSidoNm: apiData.POSESN_MAINBD_SIDO_NM || null,
      posesnMainbdSignguNm: apiData.POSESN_MAINBD_SIGNGU_NM || null,
      chrgpsnDeptNm: apiData.CHRGPSN_DEPT_NM || null,
      facltMangrTelno: apiData.FACLT_MANGR_TELNO || null,
      inoutdrDivNm: apiData.INOUTDR_DIV_NM || null,
      audtrmSeatCnt: apiData.AUDTRM_SEAT_CNT || null,
      audtrmAceptncPsncnt: apiData.AUDTRM_ACEPTNC_PSNCNT || null,
      facltTotAr: apiData.FACLT_TOT_AR || null,
      livelhOpenpublYn: apiData.LIVELH_OPENPUBL_YN || null,
      livelhGymNm: apiData.LIVELH_GYM_NM || null,
      utlzGrpNm: apiData.UTLZ_GRP_NM || null,
      facltCreatStdDe: apiData.FACLT_CREAT_STD_DE || null,
      registStatmntDe: apiData.REGIST_STATMNT_DE || null,
      compltnDe: apiData.COMPLTN_DE || null,
      suspnbizDe: apiData.SUSPNBIZ_DE || null,
      clsbizDe: apiData.CLSBIZ_DE || null,
      nationPhstrnFacltYn: apiData.NATION_PHSTRN_FACLT_YN || null,
      qukprfDesignYn: apiData.QUKPRF_DESIGN_YN || null,
      selfctrlCheckTargetYn: apiData.SELFCTRL_CHECK_TARGET_YN || null,
      registDtm: apiData.REGIST_DTM || null,
      updDtm: apiData.UPD_DTM || null,
      refineLotnoAddr: apiData.REFINE_LOTNO_ADDR || null,
      refineZipno: apiData.REFINE_ZIPNO || null,
    };
  }
}
