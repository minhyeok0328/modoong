// API 응답 타입 정의
export interface ApiResponse {
  Ggdspsnphstrnfaclt: [
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
      row?: RehabFacilityData[];
    },
  ];
}

export interface RehabFacilityData {
  SIGUN_CD: string;
  SIGUN_NM: string;
  INST_NM: string;
  REFINE_LOTNO_ADDR?: string;
  REFINE_ROADNM_ADDR?: string;
  REFINE_ZIP_CD?: string;
  REFINE_WGS84_LAT: string;
  REFINE_WGS84_LOGT: string;
  TELNO?: string;
  HMPG_URL?: string;
  INSTL_STATMNT_DE?: string;
}
