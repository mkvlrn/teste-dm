export const ErrorCodes = {
  validation: {
    user: {
      nameRequired: "validation.user.nameRequired",
      nameMustBeString: "validation.user.nameMustBeString",
      nameTooShort: "validation.user.nameTooShort",
      nameTooLong: "validation.user.nameTooLong",

      emailRequired: "validation.user.emailRequired",
      emailInvalid: "validation.user.emailInvalid",
      emailTooLong: "validation.email.emailTooLong",

      passwordRequired: "validation.password.passwordRequired",
      passwordMustBeString: "validation.password.passwordMustBeString",
      passwordInvalid: "validation.password.passwordInvalid",
    },

    employee: {
      nameRequired: "validation.employee.nameRequired",
      nameMustBeString: "validation.employee.nameMustBeString",
      nameTooShort: "validation.employee.nameTooShort",
      nameTooLong: "validation.employee.nameTooLong",

      cpfRequired: "validation.employee.cpfRequired",
      cpfMustBeString: "validation.employee.cpfMustBeString",
      cpfInvalid: "validation.employee.cpfInvalid",

      dobRequired: "validation.employee.dobRequired",
      dobInvalid: "validation.employee.dobInvalid",

      jobTitleRequired: "validation.employee.jobTitleRequired",
      jobTitleMustBeString: "validation.employee.jobTitleMustBeString",
      jobTitleTooShort: "validation.employee.jobTitleTooShort",
      jobTitleTooLong: "validation.employee.jobTitleTooLong",
    },

    certificate: {
      employeeIdRequired: "validation.certificate.employeeIdRequired",
      employeeIdInvalid: "validation.certificate.employeeIdInvalid",

      issuedAtRequired: "validation.certificate.issuedAtRequired",
      issuedAtInvalid: "validation.certificate.issuedAtInvalid",

      daysRequired: "validation.certificate.daysRequired",
      daysInvalid: "validation.certificate.daysInvalid",

      cidRequired: "validation.certificate.cidRequired",
      cidMustBeString: "validation.certificate.cidMustBeString",
      cidMustBeNumericString: "validation.certificate.cidMustBeNumericString",

      observationsMustBeString: "validation.certificate.observationsMustBeString",
      observationsTooLong: "validation.certificate.observationsTooLong",
    },
  },
} as const;
export type ErrorCodes = typeof ErrorCodes;
