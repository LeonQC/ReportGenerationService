import { PrismaClient, ReportStatus } from "@prisma/client";
import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { CreateReportInput } from "../schemas/reportSchemas";
import { generateStockOverviewPDF } from "../utils/pdfGenerator";
import { uploadReportToS3 } from "./s3UploadService";
import { AppError } from "../utils/appError";
import { getStockOverview } from "./alphaVantageService";

export const getReports = async (prisma: PrismaClient) => {
  return prisma.reportRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createReport = async (
  prisma: PrismaClient,
  input: CreateReportInput,
  redis: Redis
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
    const stockData = await getStockOverview("TSLA", redis);
    const pdfReport = await generateStockOverviewPDF(stockData);
    const fileUrl = await uploadReportToS3(pdfReport, reportId);

    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.READY,
        outputUrl: fileUrl,
      },
    });

    console.info("Report generated successfully", {
      reportId,
    });

    return { id: reportId, status: ReportStatus.READY };
  } catch (err) {
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.FAILED,
        errorMessage: (err as Error).message,
      },
    });
    if (!(err instanceof AppError)) {
      throw new AppError("Report generation failed unexpectedly", 500);
    }
    throw err;
  }
};
