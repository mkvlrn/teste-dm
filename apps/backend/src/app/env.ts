/** biome-ignore-all lint/correctness/noNodejsModules: fine for backend */
import process from "node:process";
import { z } from "zod";

const schema = z.object({
  port: z.coerce.number(),
  icdApiClientId: z.string(),
  icdApiClientSecret: z.string(),
  betterAuthSecret: z.string(),
  betterAuthUrl: z.url(),
  betterAuthSessionDuration: z.coerce.number(),
  betterAuthSessionUpdateAge: z.coerce.number(),
  betterAuthCookiePrefix: z.string(),
  mongodbUrl: z.url(),
  redisUrl: z.url(),
});

const parsedEnv = schema.safeParse(process.env);

if (parsedEnv.error) {
  const issueSummaries: string[] = parsedEnv.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `  ${path ? `'${path}'` : "root"}: ${issue.message}`;
  });

  const msg = `Validation of environment variables failed:\n${issueSummaries.join("\n")}\nCheck your environment.`;
  // biome-ignore lint/suspicious/noConsole: fine in here
  console.error(msg);
  process.exit(1);
}

export const env = parsedEnv.data;
