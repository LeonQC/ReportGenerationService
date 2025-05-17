import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

// Shared field structure
const reportBase = {
  id: z.string(),
  userId: z.string(),
  reportType: z.string(),
  timeRange: z.string(),
  mimeType: z.string(),
  status: z.string(),
  outputUrl: z.string().nullable().optional(),
  errorMessage: z.string().nullable().optional(),
  customRequest: z.string().nullable().optional(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(),
};

const createReportSchema = z.object({
  userId: z.string().uuid(),
  reportType: z.enum(["STOCK_SUMMARY", "MACRO_TRENDS", "CUSTOM"]),
  timeRange: z.enum(["TODAY", "LAST_7_DAYS", "LAST_30_DAYS"]),
  customRequest: z.string().optional(),
  mimeType: z
    .enum(["APPLICATION_PDF", "TEXT_CSV", "APPLICATION_JSON"])
    .default("APPLICATION_PDF"),
});

export const createReportResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "READY", "FAILED"]),
});
export const reportResponseSchema = z.object(reportBase);
export const reportsResponseSchema = z.array(reportResponseSchema);

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ReportResponse = z.infer<typeof reportResponseSchema>;
export type GetReportsResponse = z.infer<typeof reportsResponseSchema>;

// Generate Fastify-compatible schemas
export const { schemas: reportSchemas, $ref } = buildJsonSchemas({
  reportResponseSchema,
  reportsResponseSchema,
  createReportSchema,
  createReportResponseSchema,
});
