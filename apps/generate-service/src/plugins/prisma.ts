import fp from "fastify-plugin";
import { PrismaClient } from "../../../generated/prisma-client";

export const prisma = new PrismaClient();

export default fp(async (fastify) => {
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    await app.prisma.$disconnect();
  });
});
