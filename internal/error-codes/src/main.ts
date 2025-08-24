export const ErrorCodes = {
  validation: {
    default: "validation.default",
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

  domain: {
    userCreation: {
      emailAlreadyInUse: "domain.userCreation.emailAlreadyInUse",
      databaseError: "domain.userCreation.databaseError",
      couldNotCreateUser: "domain.userCreation.couldNotCreateUser",
    },

    userAuth: {
      logoutError: "domain.userAuth.logoutError",
      noSession: "domain.userAuth.noSession",
    },

    employee: {
      notFound: "domain.employee.notFound",
      databaseError: "domain.employee.databaseError",
    },
    employeeCreation: {
      cpfAlreadyInUse: "domain.employeeCreation.cpfAlreadyInUse",
      databaseError: "domain.employeeCreation.databaseError",
    },
    employeeUpdate: {
      cpfAlreadyInUse: "domain.employeeUpdate.cpfAlreadyInUse",
      databaseError: "domain.employeeUpdate.databaseError",
      activeInvalid: "domain.employeeUpdate.activeInvalid",
    },

    certificate: {
      notFound: "domain.certificate.notFound",
      databaseError: "domain.certificate.databaseError",
    },
    certificateCreation: {
      databaseError: "domain.certificateCreation.databaseError",
      employeeNotFound: "domain.certificateCreation.employeeNotFound",
    },
    certificateUpdate: {
      databaseError: "domain.employeeUpdate.databaseError",
    },

    query: {
      qMustBestring: "domain.query.qMustBestring",
      pageMustBePositiveNumber: "domain.query.pageMustBePositiveNumber",
      limitMustBePositiveNumber: "domain.query.limitMustBePositiveNumber",
      limitCannotExceed100: "domain.query.limitCannotExceed100",
    },
    employeeQuery: {
      activeInvalid: "domain.employeeQuery.activeInvalid",
    },
    certificateQuery: {
      employeeIdInvalid: "domain.certificateQuery.employeeIdInvalid",
    },

    who: {
      tokenFetchError: "domain.who.tokenFetchError",

      searchIsRequired: "domain.who.searchIsRequired",
      searchInvalid: "domain.who.searchInvalid",
      searchResponseInvalid: "domain.who.searchResponseInvalid",

      codeIsRequired: "domain.who.codeIsRequired",
      codeInvalid: "domain.who.codeInvalid",
      codeErrorResponse: "domain.who.codeErrorResponse",
    },
  },
} as const;
export type ErrorCodes = typeof ErrorCodes;
