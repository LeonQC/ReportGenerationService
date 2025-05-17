// src/server.ts
import fastify from "fastify";
import redisPlugin from "./plugins/redis";
import prismaPlugin from "./plugins/prisma";
import getReportsRoute from "./routes/getReports";
import postReportsRoute from "./routes/postGenerateReport";

export const buildServer = () => {
  const app = fastify({ logger: true });

  app.register(redisPlugin);
  app.register(prismaPlugin);
  app.register(getReportsRoute);
  app.register(postReportsRoute);

  return app;
};
