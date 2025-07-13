-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('STOCK_SUMMARY', 'MACRO_TRENDS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TimeRange" AS ENUM ('TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS');

-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('APPLICATION_PDF', 'TEXT_CSV', 'APPLICATION_JSON');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "ReportRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "timeRange" "TimeRange" NOT NULL,
    "mimeType" "MimeType" NOT NULL,
    "customRequest" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "s3Url" TEXT,
    "s3Key" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportRequest_userId_idx" ON "ReportRequest"("userId");

-- CreateIndex
CREATE INDEX "ReportRequest_status_idx" ON "ReportRequest"("status");

-- CreateIndex
CREATE INDEX "ReportRequest_createdAt_idx" ON "ReportRequest"("createdAt");

