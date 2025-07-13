import { PrismaClient } from "@prisma/client";
import { GoogleUserInfo } from "./authenticateWithGoogleService";

interface TokenInfo {
  accessToken: string;
  refreshToken?: string | null;
  expiry: Date;
}

export const findOrCreateUser = async (
  prisma: PrismaClient,
  googleUser: GoogleUserInfo,
  tokens: TokenInfo
) => {
  let user = await prisma.user.findUnique({
    where: { googleId: googleUser.id },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          googleAccessToken: tokens.accessToken,
          googleRefreshToken: tokens.refreshToken || user.googleRefreshToken,
          googleTokenExpiry: tokens.expiry,
          lastLoginAt: new Date(),
          loginCount: { increment: 1 },
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          googleId: googleUser.id,
          googleAccessToken: tokens.accessToken,
          googleRefreshToken: tokens.refreshToken,
          googleTokenExpiry: tokens.expiry,
          emailVerified: true,
          lastLoginAt: new Date(),
          loginCount: 1,
        },
      });
    }
  } else {
    // Update existing Google user
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleAccessToken: tokens.accessToken,
        googleRefreshToken: tokens.refreshToken || user.googleRefreshToken,
        googleTokenExpiry: tokens.expiry,
        name: googleUser.name,
        avatar: googleUser.picture,
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });
  }

  return user;
};
