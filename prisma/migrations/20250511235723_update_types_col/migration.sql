/*
  Warnings:

  - Changed the type of `reportType` on the `ReportRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeRange` on the `ReportRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mimeType` on the `ReportRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('STOCK_SUMMARY', 'MACRO_TRENDS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TimeRange" AS ENUM ('TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS');

-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('APPLICATION_PDF', 'TEXT_CSV', 'APPLICATION_JSON');

-- AlterTable
ALTER TABLE "ReportRequest" DROP COLUMN "reportType",
ADD COLUMN     "reportType" "ReportType" NOT NULL,
DROP COLUMN "timeRange",
ADD COLUMN     "timeRange" "TimeRange" NOT NULL,
DROP COLUMN "mimeType",
ADD COLUMN     "mimeType" "MimeType" NOT NULL;
