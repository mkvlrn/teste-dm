import { isValid } from "@fnando/cpf";
import { ErrorCodes } from "@repo/error-codes";
import { z } from "zod";

const minNameLength = 5;
const maxNameLength = 128;
const minJobLength = 3;
const maxJobLength = 128;

export type EmployeeEntity = {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  jobTitle: string;
  active: boolean;
};

export const CreateEmployeeSchema = z.strictObject({
  name: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.employee.nameRequired
          : ErrorCodes.validation.employee.nameMustBeString,
    })
    .min(minNameLength, { error: ErrorCodes.validation.employee.nameTooShort })
    .max(maxNameLength, { error: ErrorCodes.validation.employee.nameTooLong }),

  cpf: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.employee.cpfRequired
          : ErrorCodes.validation.employee.cpfMustBeString,
    })
    .refine((cpf) => isValid(cpf), { error: ErrorCodes.validation.employee.cpfInvalid }),

  dateOfBirth: z.iso.date({
    error: (err) =>
      err.input === undefined
        ? ErrorCodes.validation.employee.dobRequired
        : ErrorCodes.validation.employee.dobInvalid,
  }),

  jobTitle: z
    .string({
      error: (err) =>
        err.input === undefined
          ? ErrorCodes.validation.employee.jobTitleRequired
          : ErrorCodes.validation.employee.jobTitleMustBeString,
    })
    .min(minJobLength, { error: ErrorCodes.validation.employee.jobTitleTooShort })
    .max(maxJobLength, { error: ErrorCodes.validation.employee.jobTitleTooLong }),
});
export type CreateEmployeeSchema = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = z.strictObject({
  ...CreateEmployeeSchema.partial().shape,
  active: z.boolean({ error: ErrorCodes.domain.employeeUpdate.activeInvalid }).optional(),
});
export type UpdateEmployeeSchema = z.infer<typeof UpdateEmployeeSchema>;
