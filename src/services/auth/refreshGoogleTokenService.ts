import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Refresh Google access token
export const refreshGoogleToken = async (
  prisma: PrismaClient,
  userId: string
): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleRefreshToken: true,
      googleTokenExpiry: true,
      googleAccessToken: true,
    },
  });

  if (!user?.googleRefreshToken) {
    throw new Error("No refresh token available");
  }

  // Check if token is still valid (with 5 min buffer)
  const now = new Date();
  const expiry = user.googleTokenExpiry;
  const bufferTime = 5 * 60 * 1000; // 5 minutes

  if (expiry && expiry.getTime() > now.getTime() + bufferTime) {
    return user.googleAccessToken!; // Still valid
  }

  try {
    // Refresh the token
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    const newExpiry = credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    // Update database with new token
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: credentials.access_token!,
        googleTokenExpiry: newExpiry,
        googleRefreshToken:
          credentials.refresh_token || user.googleRefreshToken,
      },
    });

    return credentials.access_token!;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw new Error("Failed to refresh token");
  }
};
