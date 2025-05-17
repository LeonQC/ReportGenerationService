// src/routes/postReportsRoute.ts
import { FastifyPluginAsync } from "fastify";
import { createReportHandler } from "../handlers/postReportHandler";
import { $ref } from "../schemas/reportSchemas";

const postReportsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/reports/generate", {
    schema: {
      body: $ref("createReportSchema"),
      response: {
        201: $ref("createReportResponseSchema"),
      },
    },
    handler: createReportHandler,
  });
};

export default postReportsRoute;
