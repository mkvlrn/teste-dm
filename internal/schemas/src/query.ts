import { ErrorCodes } from "@repo/error-codes";
import { z } from "zod";

const defaultLimit = 10;
const maxLimit = 100;

const QuerySchema = z.strictObject({
  q: z.string({ error: ErrorCodes.domain.query.qMustBestring }).optional(),
  page: z.coerce
    .number({ error: ErrorCodes.domain.query.pageMustBePositiveNumber })
    .positive({ error: ErrorCodes.domain.query.pageMustBePositiveNumber })
    .default(1),
  limit: z.coerce
    .number({ error: ErrorCodes.domain.query.limitMustBePositiveNumber })
    .positive({ error: ErrorCodes.domain.query.limitMustBePositiveNumber })
    .max(maxLimit, { error: ErrorCodes.domain.query.limitCannotExceed100 })
    .default(defaultLimit),
});

export const EmployeeQuerySchema = z.strictObject({
  ...QuerySchema.shape,
  active: z
    .enum(["true", "false", "all"], { error: ErrorCodes.domain.employeeQuery.activeInvalid })
    .optional()
    .default("all"),
});
export type EmployeeQuerySchema = z.infer<typeof EmployeeQuerySchema>;

export const CertificateQuerySchema = z.strictObject({
  ...QuerySchema.shape,
  employeeId: z.string({ error: ErrorCodes.domain.certificateQuery.employeeIdInvalid }).optional(),
});
export type CertificateQuerySchema = z.infer<typeof CertificateQuerySchema>;
