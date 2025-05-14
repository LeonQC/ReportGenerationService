import { FastifyRequest, FastifyReply } from "fastify";
import { getReports } from "../services/reportService";
import { AppError } from "../utils/appError";
import { serializeReport } from "../serializers/reportSerializer";
import { GetReportsResponse } from "../schemas/reportSchemas";
import { getCached, setCached } from "../utils/cache";

const CACHE_KEY = "reports:all";
const TTL = 60;

export const getReportsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const cached = await getCached<GetReportsResponse>(
      CACHE_KEY,
      request.server.redis
    );
    if (cached) {
      return reply.send(cached);
    }

    const reportsFromDb = await getReports(request.server.prisma);

    const serializedReports = reportsFromDb.map(serializeReport);

    await setCached(CACHE_KEY, serializedReports, request.server.redis, TTL);

    return reply.send(serializedReports);
  } catch (err) {
    request.log.error(err);

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({ message: err.message });
    }

    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
