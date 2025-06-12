import { PrismaClient } from "@prisma/client";
import { InternalReportResponse } from "../../schemas/reportSchemas";
import { AppError } from "../../utils/appError";
import { serializeReportInternal } from "../../serializers/reportSerializer";

export const getDownloadReport = async (
  prisma: PrismaClient,
  reportId: string
): Promise<InternalReportResponse> => {
  const report = await prisma.reportRequest.findUnique({
    where: { id: reportId },
  });
  if (!report) {
    throw new AppError("Report not found", 404);
  }
  if (report.status !== "READY") {
    throw new AppError("Report is not ready for download", 400);
  }

  if (!report.s3Key) {
    throw new AppError("Report file not available", 400);
  }

  return serializeReportInternal(report);
};
