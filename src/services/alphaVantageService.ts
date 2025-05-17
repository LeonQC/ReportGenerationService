import axios from "axios";

const API_KEY = process.env.ALPHA_VANTAGE_COMPANY_OVERVIEW!;
const BASE_URL = "https://www.alphavantage.co/query";

export const getStockOverview = async (symbol: string) => {
  const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;

  const response = await axios.get(url, {
    headers: { "User-Agent": "report-service" },
  });

  if (response.status !== 200) {
    throw new Error(`Alpha Vantage failed with status ${response.status}`);
  }

  return response.data;
};
