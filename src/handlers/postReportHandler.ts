import { createReport } from "./../services/reportService";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../utils/appError";
import { CreateReportInput } from "../schemas/reportSchemas";

export const createReportHandler = async (
  request: FastifyRequest<{ Body: CreateReportInput }>,
  reply: FastifyReply
) => {
  try {
    const pdfBuffer = await createReport(request.server.prisma, request.body);
    return reply
      .header("Content-type", "application/pdf")
      .header("Content-Disposition", 'attachment; filename="report.pdf" ')
      .send(pdfBuffer);
  } catch (err) {
    request.log.error(err);

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ message: err.message });
    }

    return reply.status(500).send({ message: "Failed to generate report" });
  }
};
