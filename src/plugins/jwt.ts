import fp from "fastify-plugin";

export default fp(async (fastify) => {
  await fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: "7d",
      issuer: "report-service",
    },
    verify: {
      issuer: "report-service",
    },
  });

  fastify.log.info("✅ JWT plugin initialized");
});
