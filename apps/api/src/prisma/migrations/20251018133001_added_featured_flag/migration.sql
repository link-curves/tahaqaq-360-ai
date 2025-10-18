-- AlterTable
ALTER TABLE "fact_checks" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "research" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
