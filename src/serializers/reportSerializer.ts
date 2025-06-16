import { ReportRequest } from "@prisma/client";
import { InternalReportResponse } from "../schemas/reportSchemas";
import { convertUTCToLocal } from "../utils/helpers";

export const serializeReport = (r: ReportRequest) => ({
  ...r,
  reportType: r.reportType.toString(),
  timeRange: r.timeRange.toString(),
  mimeType: r.mimeType.toString(),
  status: r.status.toString(),
  createdAt: convertUTCToLocal(r.createdAt.toISOString()),
  updatedAt: convertUTCToLocal(r.updatedAt.toISOString()),
});

export const serializeReportInternal = (
  r: ReportRequest
): InternalReportResponse => ({
  ...serializeReport(r), // Reuse public serializer
  s3Url: r.s3Url,
  s3Key: r.s3Key,
});
