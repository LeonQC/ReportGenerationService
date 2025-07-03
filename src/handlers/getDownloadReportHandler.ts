import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../utils/appError";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { getDownloadReport } from "../services/report/getDownloadReportService";
import { DownloadReportParams } from "../schemas/reportSchemas";
import { s3 } from "../integrations/s3UploadService";

import { getFileExtension, getMimeTypeString } from "../utils/helpers";

export const getDownloadReportHandler = async (
  request: FastifyRequest<{ Params: DownloadReportParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const requestUserId = request.user?.userId;
    if (!requestUserId) {
      return reply.code(401).send({ error: "Not authenticated" });
    }

    const report = await getDownloadReport(request.server.prisma, id);

    if (report.userId !== requestUserId) {
      throw new AppError("Unauthorized to download this report", 403);
    }

    if (!report.s3Key) {
      throw new AppError("Report file is not yet available", 400);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: report.s3Key!,
    });
    const s3Response = await s3.send(command);

    if (!s3Response.Body) {
      throw new AppError("File not found in storage", 404);
    }

    reply.header("Content-Type", getMimeTypeString(report.mimeType));
    reply.header(
      "Content-Disposition",
      `attachment; filename="${report.reportName}"`
    );

    if (s3Response.ContentLength) {
      reply.header("Content-Length", s3Response.ContentLength);
    }

    return reply.send(s3Response.Body);
  } catch (error) {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }

    request.log.error("Error downloading report:", error);
    return reply.code(500).send({ error: "Failed to download report" });
  }
};
