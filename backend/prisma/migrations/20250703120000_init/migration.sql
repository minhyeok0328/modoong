-- CreateExtension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" VARCHAR(50) NOT NULL DEFAULT 'temporary',
    "auth_provider" VARCHAR(50),
    "provider_id" VARCHAR(255),
    "agreement" BOOLEAN NOT NULL DEFAULT false,
    "accessibility_status" VARCHAR(20),
    "activity_schedule" JSONB,
    "other_sport_description" VARCHAR(255),
    "other_disability_description" VARCHAR(255),
    "sport_preference" VARCHAR(20),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disability_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disability_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sport_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sport_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports_facilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "faclt_cd_encpt_vl" TEXT,
    "refine_wgs84_lat" DOUBLE PRECISION NOT NULL,
    "refine_wgs84_logt" DOUBLE PRECISION NOT NULL,
    "faclt_div_nm" TEXT,
    "indutype_nm" TEXT,
    "faclt_type_nm" TEXT,
    "faclt_telno" TEXT,
    "sido_nm" TEXT,
    "signgu_nm" TEXT,
    "refine_roadnm_addr" TEXT,
    "si_desc" TEXT,
    "faclt_state_nm" TEXT,
    "faclt_hmpg_addr" TEXT,
    "faclt_opert_form_cd" TEXT,
    "posesn_mainbd_nm" TEXT,
    "posesn_mainbd_sido_nm" TEXT,
    "posesn_mainbd_signgu_nm" TEXT,
    "chrgpsn_dept_nm" TEXT,
    "faclt_mangr_telno" TEXT,
    "inoutdr_div_nm" TEXT,
    "audtrm_seat_cnt" TEXT,
    "audtrm_aceptnc_psncnt" TEXT,
    "faclt_tot_ar" TEXT,
    "livelh_openpubl_yn" TEXT,
    "livelh_gym_nm" TEXT,
    "utlz_grp_nm" TEXT,
    "faclt_creat_std_de" TEXT,
    "regist_statmnt_de" TEXT,
    "compltn_de" TEXT,
    "suspnbiz_de" TEXT,
    "clsbiz_de" TEXT,
    "nation_phstrn_faclt_yn" TEXT,
    "qukprf_design_yn" TEXT,
    "selfctrl_check_target_yn" TEXT,
    "regist_dtm" TEXT,
    "upd_dtm" TEXT,
    "refine_lotno_addr" TEXT,
    "refine_zipno" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rehab_facilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sigun_cd" TEXT NOT NULL,
    "sigun_nm" TEXT NOT NULL,
    "inst_nm" TEXT NOT NULL,
    "telno" TEXT,
    "hmpg_url" TEXT,
    "instl_statmnt_de" TEXT,
    "refine_lotno_addr" TEXT,
    "refine_roadnm_addr" TEXT,
    "refine_zip_cd" TEXT,
    "refine_wgs84_lat" DOUBLE PRECISION NOT NULL,
    "refine_wgs84_logt" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rehab_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_provider_provider_id_key" ON "users"("auth_provider", "provider_id");

-- No-op migration: duplicate refactor. Intentionally empty.

-- Insert initial sport types
INSERT INTO sport_types (code, name, created_at, updated_at)
SELECT 'soccer', '축구', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM sport_types WHERE code = 'soccer')
UNION ALL
SELECT 'basketball', '농구', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM sport_types WHERE code = 'basketball')
UNION ALL
SELECT 'swimming', '수영', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM sport_types WHERE code = 'swimming')
UNION ALL
SELECT 'running', '러닝', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM sport_types WHERE code = 'running')
UNION ALL
SELECT 'table_tennis', '탁구', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM sport_types WHERE code = 'table_tennis');

-- Insert initial disability types
INSERT INTO disability_types (code, name, created_at, updated_at)
SELECT 'wheelchair', '휠체어를 사용해요', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM disability_types WHERE code = 'wheelchair')
UNION ALL
SELECT 'visual_impairment', '시각장애가 있어요', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM disability_types WHERE code = 'visual_impairment')
UNION ALL
SELECT 'intellectual_disability', '지적장애가 있어요', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM disability_types WHERE code = 'intellectual_disability')
UNION ALL
SELECT 'hearing_impairment', '청각장애가 있어요', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM disability_types WHERE code = 'hearing_impairment')
UNION ALL
SELECT 'amputation', '절단 장애가 있어요', NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM disability_types WHERE code = 'amputation');
