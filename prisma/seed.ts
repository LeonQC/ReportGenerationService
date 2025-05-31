import {
  PrismaClient,
  ReportStatus,
  ReportType,
  TimeRange,
  MimeType,
} from "@prisma/client";

console.log(ReportType);

const prisma = new PrismaClient();

const main = async () => {
  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-1",
      userId: "user-1",
      reportType: ReportType.STOCK_SUMMARY,
      timeRange: TimeRange.TODAY,
      mimeType: MimeType.APPLICATION_PDF,
      status: ReportStatus.READY,
      outputUrl: "https://example.com/report1.pdf",
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-2",
      userId: "user-2",
      reportType: ReportType.MACRO_TRENDS,
      timeRange: TimeRange.LAST_7_DAYS,
      mimeType: MimeType.APPLICATION_PDF,
      status: ReportStatus.PROCESSING,
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-3",
      userId: "user-3",
      reportType: ReportType.MACRO_TRENDS,
      timeRange: TimeRange.LAST_30_DAYS,
      mimeType: MimeType.TEXT_CSV,
      status: ReportStatus.FAILED,
      errorMessage: "API timeout during generation",
    },
  });

  console.info("✅ Seed data with IDs inserted");
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("✅ Seed data completed");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
