import { FastifyPluginAsync } from "fastify";
import { $ref } from "../schemas/reportSchemas";
import { getReportsHandler } from "../handlers/getReportsHandler";

const getReportsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/reports", {
    schema: {
      response: {
        200: $ref("reportsResponseSchema"),
      },
    },
    handler: getReportsHandler,
  });
};

export default getReportsRoute;
