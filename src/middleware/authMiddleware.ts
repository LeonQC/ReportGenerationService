import { FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT } from "../services/auth";

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = extractToken(request);

    if (!token) {
      return reply.code(401).send({ error: "No token provided" });
    }

    const payload = verifyJWT(token);

    request.user = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    return reply.code(401).send({ error: "Invalid token" });
  }
};

const extractToken = (request: FastifyRequest): string | null => {
  // Check Authorization header
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookie
  const token = request.cookies?.token;
  if (token) {
    return token;
  }

  return null;
};
