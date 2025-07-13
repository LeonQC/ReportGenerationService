import { FastifyRequest, FastifyReply } from "fastify";
import { serializeUserProfile } from "../../serializers/userSerializer";

export const getProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({ error: "Not authenticated" });
    }

    const user = await request.server.prisma.user.findUnique({
      where: { id: request.user.userId },
    });

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.send({ user: serializeUserProfile(user) });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return reply.code(500).send({ error: "Failed to fetch profile" });
  }
};
