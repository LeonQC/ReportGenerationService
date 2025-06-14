import { FastifyPluginAsync } from "fastify";
import { $ref } from "../schemas/reportSchemas";
import { getDownloadReportHandler } from "../handlers/getDownloadReportHandler";

const getDownloadReportRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/reports/:id/download", {
    schema: {
      params: $ref("downloadReportParamsSchema"),
    },
    handler: getDownloadReportHandler,
  });
};

export default getDownloadReportRoute;
