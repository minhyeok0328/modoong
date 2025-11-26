-- CreateTable
CREATE TABLE "disability_sports_facilities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "bizrno" VARCHAR(20) NOT NULL,
    "facility_name" VARCHAR(255) NOT NULL,
    "facility_owner" VARCHAR(255),
    "facility_phone" VARCHAR(50),
    "facility_address" VARCHAR(500) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "vehicle_support" VARCHAR(100),
    "disability_support" TEXT,
    "facility_image_base64" TEXT,
    "course_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disability_sports_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disability_sports_facilities_bizrno_key" ON "disability_sports_facilities"("bizrno");
