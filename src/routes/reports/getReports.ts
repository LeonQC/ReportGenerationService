import { FastifyPluginAsync } from "fastify";
import { $ref } from "../../schemas/reportSchemas";
import { getReportsHandler } from "../../handlers/getReportsHandler";
import { authMiddleware } from "../../middleware/authMiddleware";

const getReportsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/reports", {
    preHandler: [authMiddleware],
    schema: {
      response: {
        200: $ref("reportsResponseSchema"),
        401: $ref("errorResponseSchema"), // ✨ Add error responses
        500: $ref("errorResponseSchema"),
      },
    },
    handler: getReportsHandler,
  });
};

export default getReportsRoute;
