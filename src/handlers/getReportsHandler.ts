import { FastifyRequest, FastifyReply } from "fastify";
import { getReports } from "../services/report";
import { AppError } from "../utils/appError";

export const getReportsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const reports = await getReports(
      request.server.prisma,
      request.server.redis
    );
    return reply.send(reports);
  } catch (err) {
    request.log.error(err);
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ message: err.message });
    }
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
