import { FastifyPluginAsync } from "fastify";
import { getGoogleAuthHandler } from "../../handlers/auth/getGoogleAuthHandler";
import { googleCallbackHandler } from "../../handlers/auth/googleCallbackHandler";
import { getProfileHandler } from "../../handlers/auth/getProfileHandler";
import { logoutHandler } from "../../handlers/auth/logoutHandler";
import { authMiddleware } from "../../middleware/authMiddleware";
import { $ref } from "../../schemas/authSchemas";

const authRoute: FastifyPluginAsync = async (fastify) => {
  // Public routes
  fastify.get("/auth/google", {
    schema: {
      response: {
        200: $ref("authUrlResponseSchema"),
        500: $ref("errorResponseSchema"),
      },
    },
    handler: getGoogleAuthHandler,
  });

  fastify.get("/auth/google/callback", {
    handler: googleCallbackHandler,
  });

  fastify.post("/auth/logout", {
    schema: {
      response: {
        200: $ref("logoutResponseSchema"),
      },
    },
    handler: logoutHandler,
  });

  // Protected routes
  fastify.get("/auth/profile", {
    preHandler: [authMiddleware],
    schema: {
      response: {
        200: $ref("profileResponseSchema"),
        401: $ref("errorResponseSchema"),
        404: $ref("errorResponseSchema"),
        500: $ref("errorResponseSchema"),
      },
    },
    handler: getProfileHandler,
  });
};

export default authRoute;
