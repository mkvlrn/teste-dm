import { ErrorCodes } from "@repo/error-codes";
import { z } from "zod";

const minCertificateDays = 1;
const maxCertificateDays = 365;
const maxObservationsLength = 2048;

export type CertificateEntity = {
  id: string;
  employeeId: string;
  issuedAt: string;
  days: number;
  cid: string;
  observations?: string;
};

export const CreateCertificateSchema = z.strictObject({
  employeeId: z.cuid2({
    error: (err) =>
      err.input === undefined
        ? ErrorCodes.validation.certificate.employeeIdRequired
        : ErrorCodes.validation.certificate.employeeIdInvalid,
  }),

  issuedAt: z.iso.datetime({
    error: (err) =>
      err.input === undefined
        ? ErrorCodes.validation.certificate.issuedAtRequired
        : ErrorCodes.validation.certificate.issuedAtInvalid,
  }),

  days: z
    .number({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.certificate.daysRequired
          : ErrorCodes.validation.certificate.daysInvalid,
    })
    .min(minCertificateDays, { error: ErrorCodes.validation.certificate.daysInvalid })
    .max(maxCertificateDays, { error: ErrorCodes.validation.certificate.daysInvalid }),

  cid: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.certificate.cidRequired
          : ErrorCodes.validation.certificate.cidMustBeString,
    })
    .regex(/^\d+$/, ErrorCodes.validation.certificate.cidMustBeNumericString),

  observations: z
    .string({ error: ErrorCodes.validation.certificate.observationsMustBeString })
    .max(maxObservationsLength, { error: ErrorCodes.validation.certificate.observationsTooLong })
    .optional(),
});
export type CreateCertificateSchema = z.infer<typeof CreateCertificateSchema>;
