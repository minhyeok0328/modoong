-- AlterTable
ALTER TABLE "sports_facilities" ADD COLUMN     "image_src" TEXT,
ADD COLUMN     "street_view_url" TEXT,
ADD COLUMN     "amenities" JSONB;
