// src/plugins/prisma.ts
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async (instance) => {
      await instance.prisma.$disconnect();
    });
  } catch (err) {
    fastify.log.error(err, "❌ Failed to initialize Prisma");
    throw err;
  }
};

export default fp(prismaPlugin, {
  name: "prisma",
  fastify: "4.x",
});
