import type { betterAuth } from "better-auth";

export type BetterAuthInstance = ReturnType<typeof betterAuth>;
export const betterAuthSymbol = Symbol("betterAuth");
