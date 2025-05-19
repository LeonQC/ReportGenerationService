-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "ReportRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "timeRange" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "customRequest" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "outputUrl" TEXT,
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
