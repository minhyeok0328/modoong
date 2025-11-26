-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age_group" VARCHAR(20),
ADD COLUMN     "assistant_certificate" BOOLEAN,
ADD COLUMN     "assistant_services" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "gender" VARCHAR(10),
ADD COLUMN     "guardian_linked_account" VARCHAR(255),
ADD COLUMN     "guardian_notifications" BOOLEAN,
ADD COLUMN     "hourly_rate" VARCHAR(50),
ADD COLUMN     "phone_number" VARCHAR(20),
ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vms_id" VARCHAR(50),
ADD COLUMN     "volunteer_activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "volunteer_experience" BOOLEAN;
