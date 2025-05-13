// src/server.ts
import fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import getReportsRoute from "./routes/getReports";

export const buildServer = () => {
  const app = fastify({ logger: true });

  app.register(prismaPlugin);
  app.register(getReportsRoute);

  return app;
};
