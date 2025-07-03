// src/server.ts
import fastify from "fastify";
import redisPlugin from "./plugins/redis";
import prismaPlugin from "./plugins/prisma";
import cookiePlugin from "./plugins/cookie";
import jwtPlugin from "./plugins/jwt";
import getReportsRoute from "./routes/reports/getReports";
import postReportsRoute from "./routes/reports/postGenerateReport";
import getDownloadReportRoute from "./routes/reports/getDownloadReport";
import authRoute from "./routes/auth/authRoute";
import { authSchemas } from "./schemas/authSchemas"; // ✨ Add this import
import { reportSchemas } from "./schemas/reportSchemas"; // ✨ Add this import

export const buildServer = () => {
  const app = fastify({ logger: true });

  app.register(redisPlugin);
  app.register(prismaPlugin);
  app.register(cookiePlugin);
  app.register(jwtPlugin);

  // ✨ Register schemas BEFORE routes
  for (const schema of authSchemas) {
    app.addSchema(schema);
  }

  for (const schema of reportSchemas) {
    app.addSchema(schema);
  }

  // Now register routes (they can use $ref successfully)
  app.register(getReportsRoute);
  app.register(postReportsRoute);
  app.register(getDownloadReportRoute);
  app.register(authRoute);

  return app;
};
