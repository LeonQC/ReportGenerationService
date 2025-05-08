// user-service entrypoint
import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/health", async () => {
  return { status: "ok - user-service" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log("🚀 User service running at http://localhost:3001/health");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
