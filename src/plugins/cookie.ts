import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import { FastifyPluginAsync } from "fastify";

const cookiePlugin: FastifyPluginAsync = async (fastify) => {
  try {
    await fastify.register(fastifyCookie, {
      secret: process.env.JWT_SECRET, // For signed cookies (optional)
      parseOptions: {
        httpOnly: true,
        secure: false, // Set to false for local development (HTTP)
        sameSite: "lax",
      },
    });

    fastify.log.info("✅ Cookie plugin initialized");
  } catch (err) {
    fastify.log.error(err, "❌ Failed to initialize Cookie plugin");
    throw err;
  }
};

export default fp(cookiePlugin, {
  name: "cookie",
  fastify: "4.x",
});
