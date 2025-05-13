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

// Zod schemas
export const reportResponseSchema = z.object(reportBase);
export const reportsResponseSchema = z.array(reportResponseSchema);

// Type inference
export type ReportResponse = z.infer<typeof reportResponseSchema>;
export type GetReportsResponse = z.infer<typeof reportsResponseSchema>;

// Generate Fastify-compatible schemas
export const { schemas: reportSchemas, $ref } = buildJsonSchemas({
  reportResponseSchema,
  reportsResponseSchema,
});
