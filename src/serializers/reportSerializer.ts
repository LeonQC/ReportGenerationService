import { ReportRequest } from "@prisma/client";
import { InternalReportResponse } from "../schemas/reportSchemas";

export const serializeReport = (r: ReportRequest) => ({
  ...r,
  reportType: r.reportType.toString(),
  timeRange: r.timeRange.toString(),
  mimeType: r.mimeType.toString(),
  status: r.status.toString(),
  createdAt: r.createdAt.toISOString(),
  updatedAt: r.updatedAt.toISOString(),
});

export const serializeReportInternal = (
  r: ReportRequest
): InternalReportResponse => ({
  ...serializeReport(r), // Reuse public serializer
  s3Url: r.s3Url,
  s3Key: r.s3Key,
});
