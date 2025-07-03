import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import { generateJWT } from "./generateJWTService";
import { findOrCreateUser } from "./findOrCreateUserService";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface TokenInfo {
  accessToken: string;
  refreshToken?: string | null;
  expiry: Date;
}

export const authenticateWithGoogle = async (
  prisma: PrismaClient,
  code: string
) => {
  try {
    // Get tokens from Google
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.email) {
      throw new Error("No email found in Google profile");
    }

    // Calculate token expiry
    const tokenExpiry = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    // Find or create user in database
    const user = await findOrCreateUser(
      prisma,
      {
        id: googleUser.id!,
        email: googleUser.email,
        name: googleUser.name || "",
        picture: googleUser.picture || "",
      },
      {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiry: tokenExpiry,
      }
    );

    // Generate our app JWT token
    const appToken = generateJWT(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token: appToken,
    };
  } catch (error) {
    console.error("Google auth error:", error);
    throw new Error("Authentication failed");
  }
};
