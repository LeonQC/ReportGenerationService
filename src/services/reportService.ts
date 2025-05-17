import { PrismaClient, ReportStatus } from "@prisma/client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { CreateReportInput } from "../schemas/reportSchemas";
import { generateStockOverviewPDF } from "../utils/pdfGenerator";

export const getReports = async (prisma: PrismaClient) => {
  return prisma.reportRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createReport = async (
  prisma: PrismaClient,
  input: CreateReportInput
) => {
  const reportId = uuidv4();

  await prisma.reportRequest.create({
    data: {
      id: reportId,
      userId: input.userId,
      reportType: input.reportType,
      timeRange: input.timeRange,
      mimeType: input.mimeType,
      customRequest: input.customRequest,
      status: ReportStatus.PROCESSING,
    },
  });

  try {
    const apiKey = process.env.ALPHA_VANTAGE_COMPANY_OVERVIEW!;
    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "OVERVIEW",
        symbol: "TSLA", // TODO: support dynamic symbol later
        apikey: apiKey,
      },
    });

    await generateStockOverviewPDF(response.data);
    const outputUrl = `https://example.com/reports/${reportId}.pdf`; // TODO: replace with s3 URL later
    return await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.READY,
        outputUrl,
      },
    });
  } catch (err) {
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.FAILED,
        errorMessage: (err as Error).message,
      },
    });
    throw err;
  }
};
