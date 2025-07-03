import { User } from "@prisma/client";
import { convertUTCToLocal } from "../utils/helpers";

// Public user data (safe for API responses)
export const serializeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  emailVerified: user.emailVerified,
  isActive: user.isActive,
  timezone: user.timezone,
  language: user.language,
  createdAt: convertUTCToLocal(user.createdAt.toISOString()),
  updatedAt: convertUTCToLocal(user.updatedAt.toISOString()),
});

// User profile (includes more details for authenticated user)
export const serializeUserProfile = (user: User) => ({
  ...serializeUser(user),
  lastLoginAt: user.lastLoginAt
    ? convertUTCToLocal(user.lastLoginAt.toISOString())
    : null,
  loginCount: user.loginCount,
});

// Internal user data (includes sensitive fields, never sent to client)
export const serializeUserInternal = (user: User) => ({
  ...serializeUserProfile(user),
  googleId: user.googleId,
  // Note: Never include tokens, passwords, etc. in any serializer
});
