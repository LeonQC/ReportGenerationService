import { PrismaClient } from "@prisma/client";
import type { Redis } from "ioredis";
import { getCached, setCached } from "../../utils/cache";
import { serializeReport } from "../../serializers/reportSerializer";
import { GetReportsResponse } from "../../schemas/reportSchemas";

const CACHE_KEY = "reports:all";
const TTL = 60 * 60 * 24;

export const getReports = async (
  prisma: PrismaClient,
  redis: Redis
): Promise<GetReportsResponse> => {
  const cached = await getCached<GetReportsResponse>(CACHE_KEY, redis);
  if (cached) return cached;

  const reportsFromDb = await prisma.reportRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = reportsFromDb.map(serializeReport);
  await setCached(CACHE_KEY, serialized, redis, TTL);

  return serialized;
};
