import { FastifyRequest, FastifyReply } from "fastify";

export const logoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.clearCookie("token", {
    path: "/", // ✅ must match path used in setCookie
  });

  return reply.send({ message: "Logged out successfully" });
};
