import { PrismaClient } from "@prisma/client";

export const getReports = async (prisma: PrismaClient) => {
  return prisma.reportRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};
