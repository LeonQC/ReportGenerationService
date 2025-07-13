import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../utils/appError";
import { getReports } from "../services/report/getReportService";

export const getReportsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return reply.code(401).send({ error: "Not authenticated" });
    }

    // Get reports for this specific user only
    const reports = await getReports(
      request.server.prisma,
      request.server.redis,
      userId
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
