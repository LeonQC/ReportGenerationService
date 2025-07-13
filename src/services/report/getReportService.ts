import { PrismaClient } from "@prisma/client";
import type { Redis } from "ioredis";
import { getCached, setCached } from "../../utils/cache";
import { serializeReport } from "../../serializers/reportSerializer";
import { GetReportsResponse } from "../../schemas/reportSchemas";

const CACHE_KEY_PREFIX = "reports:user:";
const TTL = 10;

export const getReports = async (
  prisma: PrismaClient,
  redis: Redis,
  userId: string
): Promise<GetReportsResponse> => {
  const cacheKey = `${CACHE_KEY_PREFIX}${userId}`; // ✨ User-specific cache key

  const cached = await getCached<GetReportsResponse>(cacheKey, redis);
  if (cached) return cached;

  const reportsFromDb = await prisma.reportRequest.findMany({
    where: { userId }, // ✨ Filter by user
    orderBy: { createdAt: "desc" },
  });

  const serialized = reportsFromDb.map(serializeReport);
  await setCached(cacheKey, serialized, redis, TTL);

  return serialized;
};
