import { FastifyRequest, FastifyReply } from "fastify";
import { authenticateWithGoogle } from "../../services/auth";

interface GoogleCallbackQuery {
  code: string;
  state?: string;
}

export const googleCallbackHandler = async (
  request: FastifyRequest<{ Querystring: GoogleCallbackQuery }>,
  reply: FastifyReply
) => {
  try {
    const { code } = request.query;

    if (!code) {
      return reply.code(400).send({ error: "No authorization code provided" });
    }

    const authResult = await authenticateWithGoogle(
      request.server.prisma,
      code
    );

    // Set HTTP-only cookie
    reply.setCookie("token", authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Redirect to frontend
    return reply.redirect(`http://localhost:5173/auth/callback`);
  } catch (error) {
    console.error("Google callback error:", error);
    return reply.redirect(`http://localhost:5173/login?error=auth_failed`);
  }
};
