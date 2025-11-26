// API 응답 타입 정의
export interface ApiResponse {
  TBGGPHSTRNFACLTM: [
    {
      head: [
        {
          list_total_count: number;
        },
        {
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
        },
        {
          api_version: string;
        },
      ];
    },
    {
      row?: SportsFacilityData[];
    },
  ];
}

export interface SportsFacilityData {
  FACLT_CD_ENCPT_VL?: string;
  SI_DESC: string;
  FACLT_DIV_NM: string;
  INDUTYPE_NM: string;
  FACLT_TYPE_NM: string;
  FACLT_STATE_NM?: string;
  REFINE_LOTNO_ADDR?: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_ZIPNO?: string;
  REFINE_WGS84_LOGT: string;
  REFINE_WGS84_LAT: string;
  FACLT_TELNO: string;
  FACLT_HMPG_ADDR?: string;
  SIDO_NM: string;
  SIGNGU_NM: string;
  FACLT_OPERT_FORM_CD?: string;
  POSESN_MAINBD_NM?: string;
  POSESN_MAINBD_SIDO_NM?: string;
  POSESN_MAINBD_SIGNGU_NM?: string;
  CHRGPSN_DEPT_NM?: string;
  FACLT_MANGR_TELNO?: string;
  INOUTDR_DIV_NM?: string;
  AUDTRM_SEAT_CNT?: string;
  AUDTRM_ACEPTNC_PSNCNT?: string;
  FACLT_TOT_AR?: string;
  LIVELH_OPENPUBL_YN?: string;
  LIVELH_GYM_NM?: string;
  UTLZ_GRP_NM?: string;
  FACLT_CREAT_STD_DE?: string;
  REGIST_STATMNT_DE?: string;
  SUSPNBIZ_DE?: string;
  COMPLTN_DE?: string;
  CLSBIZ_DE?: string;
  NATION_PHSTRN_FACLT_YN?: string;
  QUKPRF_DESIGN_YN?: string;
  SELFCTRL_CHECK_TARGET_YN?: string;
  REGIST_DTM?: string;
  UPD_DTM?: string;
}
