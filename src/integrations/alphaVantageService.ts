import axios from "axios";
import { getCached, setCached } from "../utils/cache";
import { AppError } from "../utils/appError";
import type { Redis } from "ioredis";
import { ReportOverview } from "../types/alphavantage";

const API_KEY = process.env.ALPHA_VANTAGE_COMPANY_OVERVIEW!;
const BASE_URL = "https://www.alphavantage.co/query";
const DEFAULT_TTL = 60 * 60;

export const getStockOverview = async (
  symbol: string,
  redis: Redis
): Promise<ReportOverview> => {
  const cacheKey = `stock-overview:${symbol}`;

  try {
    const cached = await getCached<ReportOverview>(cacheKey, redis);

    if (cached) {
      return cached;
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: "OVERVIEW",
        symbol, // TODO: support dynamic symbol later
        apikey: API_KEY,
      },
    });

    if (response.status !== 200) {
      throw new AppError(
        `Alpha Vantage failed with status ${response.status}`,
        502
      );
    }

    await setCached(cacheKey, response.data, redis, DEFAULT_TTL);

    return response.data;
  } catch (error) {
    console.error("Error fetching stock overview: alpha vantage", error);
    throw new AppError("Failed to fetch stock overview: alpha vantage", 500);
  }
};
