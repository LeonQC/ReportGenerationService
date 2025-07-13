import { FastifyPluginAsync } from "fastify";
import { $ref } from "../../schemas/reportSchemas";
import { getDownloadReportHandler } from "../../handlers/getDownloadReportHandler";
import { authMiddleware } from "../../middleware/authMiddleware";

const getDownloadReportRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/reports/:id/download", {
    preHandler: [authMiddleware],
    schema: {
      response: {
        200: $ref("reportsResponseSchema"),
        401: $ref("errorResponseSchema"),
        500: $ref("errorResponseSchema"),
      },
    },
    handler: getDownloadReportHandler,
  });
};

export default getDownloadReportRoute;
