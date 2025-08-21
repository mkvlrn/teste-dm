import { hash, verify } from "argon2";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "#/app/env";
import { PrismaClient } from "#/generated/prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  // biome-ignore lint/style/useNamingConvention: blame better-auth for bad casing
  baseURL: env.betterAuthUrl,
  basePath: "auth",
  secret: env.betterAuthSecret,
  database: prismaAdapter(prisma, { provider: "mongodb" }),
  advanced: {
    database: { generateId: false }, // for mongodb, https://github.com/better-auth/better-auth/issues/4106
    cookiePrefix: env.betterAuthCookiePrefix,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      // use argon2 for password hashing
      hash,
      verify(data) {
        return verify(data.hash, data.password);
      },
    },
  },
  session: {
    expiresIn: env.betterAuthSessionDuration,
    updateAge: env.betterAuthSessionUpdateAge,
  },
  telemetry: { enabled: false },
});
