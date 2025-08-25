/** biome-ignore-all lint/style/useNamingConvention: api forces this naming convention */
import { ErrorCodes } from "@repo/error-codes";
import { z } from "zod";

export const WhoAuthSchema = z.strictObject({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});
export type WhoAuthSchema = z.infer<typeof WhoAuthSchema>;

export const WhoQuerySchema = z.strictObject({
  q: z.string({
    error: (err) =>
      err.input === undefined
        ? ErrorCodes.domain.who.searchIsRequired
        : ErrorCodes.domain.who.searchInvalid,
  }),
});
export type WhoQuerySchema = z.infer<typeof WhoQuerySchema>;

export const WhoCodeResponseSchema = z.object({
  title: z.object({ "@value": z.string() }),
});
export type WhoCodeResponseSchema = z.infer<typeof WhoCodeResponseSchema>;

export const WhoSearchResponseSchema = z.object({
  destinationEntities: z.array(z.object({ id: z.url(), title: z.string() })),
});
export type WhoSearchResponseSchema = z.infer<typeof WhoSearchResponseSchema>;
