import {
  PrismaClient,
  ReportStatus,
  ReportType,
  TimeRange,
  MimeType,
} from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.info("🌱 Starting seed process...");

  // ✨ CREATE USERS FIRST
  const user1 = await prisma.user.create({
    data: {
      id: "user-1",
      email: "john.doe@example.com",
      name: "John Doe",
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
      emailVerified: true,
      isActive: true,
      loginCount: 0,
      timezone: "UTC",
      language: "en",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user-2",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      avatar: "https://avatars.githubusercontent.com/u/2?v=4",
      emailVerified: true,
      isActive: true,
      loginCount: 0,
      timezone: "UTC",
      language: "en",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user-3",
      email: "admin@reportservice.com",
      name: "System Admin",
      avatar: "https://avatars.githubusercontent.com/u/3?v=4",
      emailVerified: true,
      isActive: true,
      loginCount: 0,
      timezone: "UTC",
      language: "en",
    },
  });

  console.info("✅ Created users:", {
    user1: user1.email,
    user2: user2.email,
    user3: user3.email,
  });

  // ✨ NOW CREATE REPORTS (linked to existing users)
  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-1",
      userId: "user-1", // References user created above
      reportName: "Daily Stock Summary",
      reportType: ReportType.STOCK_SUMMARY,
      timeRange: TimeRange.TODAY,
      mimeType: MimeType.APPLICATION_PDF,
      status: ReportStatus.READY,
      s3Url: "https://example.com/report1.pdf",
      s3Key: "reports/report-uuid-1.pdf",
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-2",
      userId: "user-2", // References user created above
      reportName: "Weekly Macro Trends",
      reportType: ReportType.MACRO_TRENDS,
      timeRange: TimeRange.LAST_7_DAYS,
      mimeType: MimeType.TEXT_CSV,
      status: ReportStatus.READY,
      s3Url: "https://example.com/report2.csv",
      s3Key: "reports/report-uuid-2.csv",
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-3",
      userId: "user-3", // References user created above
      reportName: "Monthly Custom Analysis",
      reportType: ReportType.CUSTOM,
      timeRange: TimeRange.LAST_30_DAYS,
      mimeType: MimeType.APPLICATION_JSON,
      status: ReportStatus.READY,
      s3Url: "https://example.com/report3.json",
      s3Key: "reports/report-uuid-3.json",
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-4",
      userId: "user-1", // References user created above
      reportName: "Weekly Stock Summary",
      reportType: ReportType.STOCK_SUMMARY,
      timeRange: TimeRange.LAST_7_DAYS,
      mimeType: MimeType.APPLICATION_PDF,
      status: ReportStatus.PROCESSING,
    },
  });

  await prisma.reportRequest.create({
    data: {
      id: "report-uuid-5",
      userId: "user-2", // References user created above
      reportName: "Monthly Macro Analysis",
      reportType: ReportType.MACRO_TRENDS,
      timeRange: TimeRange.LAST_30_DAYS,
      mimeType: MimeType.TEXT_CSV,
      status: ReportStatus.FAILED,
      errorMessage: "API timeout during generation",
    },
  });

  console.info("✅ Seed data with users and reports completed");
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("✅ Seed process finished successfully");
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
