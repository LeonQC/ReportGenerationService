// src/routes/postReportsRoute.ts
import { FastifyPluginAsync } from "fastify";
import { createReportHandler } from "../../handlers/postReportHandler";
import { $ref } from "../../schemas/reportSchemas";
import { authMiddleware } from "../../middleware/authMiddleware";

const postReportsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/reports/generate", {
    preHandler: [authMiddleware], // ✨ Protect this route
    schema: {
      body: $ref("createReportSchema"),
      response: {
        201: $ref("createReportResponseSchema"),
        400: $ref("errorResponseSchema"), // ✨ Add error responses
        401: $ref("errorResponseSchema"),
        500: $ref("errorResponseSchema"),
      },
    },
    handler: createReportHandler,
  });
};

export default postReportsRoute;
