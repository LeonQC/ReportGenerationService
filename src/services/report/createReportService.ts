import { MimeType, PrismaClient, ReportStatus } from "@prisma/client";
import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { CreateReportInput } from "../../schemas/reportSchemas";
import { generateStockOverviewPDF } from "../../utils/pdfGenerator";
import { uploadReportToS3 } from "../../integrations/s3UploadService";
import { AppError } from "../../utils/appError";
import { getStockOverview } from "../../integrations/alphaVantageService";

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
    // Fetch stock data based on report type
    const stockData = await getStockOverview("TSLA", redis);

    let reportData: Buffer;
    switch (input.mimeType) {
      case MimeType.APPLICATION_PDF:
        reportData = await generateStockOverviewPDF(stockData);
        break;
      // case MimeType.TEXT_CSV:
      //   reportData = generateDummyCSV();
      //   break;
      // case MimeType.APPLICATION_JSON:
      //   reportData = generateDummyJSON();
      //   break;
      default:
        throw new AppError(`Unsupported MIME type: ${input.mimeType}`, 400);
    }
    // Upload the report to S3
    const { s3Key, s3Url } = await uploadReportToS3(
      reportData,
      reportId,
      input.mimeType
    );

    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.READY,
        s3Key: s3Key,
        s3Url: s3Url,
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
