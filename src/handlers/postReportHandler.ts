import { createReport } from "../services/report";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../utils/appError";
import { CreateReportInput } from "../schemas/reportSchemas";

export const createReportHandler = async (
  request: FastifyRequest<{ Body: CreateReportInput }>,
  reply: FastifyReply
) => {
  try {
    const result = await createReport(
      request.server.prisma,
      request.body,
      request.server.redis
    );
    return reply.status(201).send(result);
  } catch (err) {
    request.log.error(err);

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ message: err.message });
    }

    return reply.status(500).send({ message: "Failed to generate report" });
  }
};
