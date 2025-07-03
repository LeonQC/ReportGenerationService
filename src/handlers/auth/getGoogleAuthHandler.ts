import { FastifyRequest, FastifyReply } from "fastify";
import { getGoogleAuthUrl } from "../../services/auth/getGoogleAuthUrlService";

export const getGoogleAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authUrl = getGoogleAuthUrl();
    return reply.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return reply.code(500).send({ error: "Failed to generate auth URL" });
  }
};
