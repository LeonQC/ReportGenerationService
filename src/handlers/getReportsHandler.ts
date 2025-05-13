import { FastifyRequest, FastifyReply } from "fastify";
import { getReports } from "../services/reportService";
import { AppError } from "../utils/appError";
import { serializeReport } from "../serializers/reportSerializer";
import { GetReportsResponse } from "../schemas/reportSchemas";

export const getReportsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const reportsFromDb = await getReports(request.server.prisma);

    const reports: GetReportsResponse = reportsFromDb.map(serializeReport);

    return reply.send(reports);
  } catch (err) {
    request.log.error(err);

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ message: err.message });
    }

    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
