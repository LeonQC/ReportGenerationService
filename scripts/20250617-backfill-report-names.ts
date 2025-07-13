import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const backfillReportNames = async () => {
  console.log("🔄 Starting backfill of report names...");
  const reportsWithoutNames = await prisma.reportRequest.findMany({
    where: { reportName: null },
    select: {
      id: true,
      reportType: true,
      createdAt: true,
    },
  });

  if (reportsWithoutNames.length === 0) {
    console.log("✅ No reports found that need names backfilled.");
    return;
  }

  for (const report of reportsWithoutNames) {
    const reportName = `${
      report.reportType
    } Report - ${report.createdAt.toISOString()}`;
    await prisma.reportRequest.update({
      where: { id: report.id },
      data: { reportName },
    });
    console.log(`✅ Updated report ${report.id}: "${reportName}"`);
  }
  console.log("🎉 Backfill completed successfully!");
};

backfillReportNames()
  .then(async () => {
    await prisma.$disconnect();
    console.info("✅ Seed data completed");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
