import { ErrorCodes } from "@repo/error-codes";
import { z } from "zod";

const minNameLength = 5;
const maxNameLength = 128;
const maxEmaillength = 128;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,128}$/;

export type User = {
  id: string;
  name: string;
  email: string;
};

export const CreateUserSchema = z.strictObject({
  name: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.user.nameRequired
          : ErrorCodes.validation.user.nameMustBeString,
    })
    .min(minNameLength, { error: ErrorCodes.validation.user.nameTooShort })
    .max(maxNameLength, { error: ErrorCodes.validation.user.nameTooLong }),

  email: z
    .email({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.user.emailRequired
          : ErrorCodes.validation.user.emailInvalid,
    })
    .max(maxEmaillength, { error: ErrorCodes.validation.user.emailTooLong }),

  password: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.user.passwordRequired
          : ErrorCodes.validation.user.passwordMustBeString,
    })
    .regex(passwordRegex, ErrorCodes.validation.user.passwordInvalid),
});
export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
