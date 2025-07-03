import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().nullable(),
  emailVerified: z.boolean(), // ✨ Add missing fields
  isActive: z.boolean(), // ✨ Add missing fields
  timezone: z.string().nullable(), // ✨ Add missing fields
  language: z.string().nullable(), // ✨ Add missing fields
  lastLoginAt: z.string().nullable(), // ✨ Add missing fields
  loginCount: z.number(), // ✨ Add missing fields
  createdAt: z.string(),
  updatedAt: z.string(),
});

const googleCallbackSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
  refreshToken: z.string().optional(),
});

// ✨ Add the schemas your auth route needs
const authUrlResponseSchema = z.object({
  authUrl: z.string().url(),
});

const profileResponseSchema = z.object({
  user: userSchema,
});

const logoutResponseSchema = z.object({
  message: z.string(),
});

const errorResponseSchema = z.object({
  error: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type GoogleCallback = z.infer<typeof googleCallbackSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type AuthUrlResponse = z.infer<typeof authUrlResponseSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    userSchema,
    googleCallbackSchema,
    authResponseSchema,
    authUrlResponseSchema, // ✨ Your route needs this
    profileResponseSchema, // ✨ Your route needs this
    logoutResponseSchema, // ✨ Your route needs this
    errorResponseSchema, // ✨ Your route needs this
  },
  {
    $id: "authSchemas",
  }
);
