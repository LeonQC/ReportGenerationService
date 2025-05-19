import { ReportRequest } from "@prisma/client";

export const serializeReport = (r: ReportRequest) => ({
  ...r,
  reportType: r.reportType.toString(),
  timeRange: r.timeRange.toString(),
  mimeType: r.mimeType.toString(),
  status: r.status.toString(),
  createdAt: r.createdAt.toISOString(),
  updatedAt: r.updatedAt.toISOString(),
});
