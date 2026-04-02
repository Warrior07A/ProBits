-- DropForeignKey
ALTER TABLE "Rooms" DROP CONSTRAINT "Rooms_student_id_fkey";

-- AlterTable
ALTER TABLE "Rooms" ALTER COLUMN "student_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
