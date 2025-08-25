export const ErrorCodes = {
  validation: {
    default: "Erro de validação",
    user: {
      nameRequired: "Nome é campo obrigatório",
      nameMustBeString: "Nome deve ser do tipo texto",
      nameTooShort: "Nome é muito curto",
      nameTooLong: "Nome é muito longo",

      emailRequired: "E-mail é campo obrigatório",
      emailInvalid: "E-mail inválido",
      emailTooLong: "E-mail é muito longo",

      passwordRequired: "Senha é campo obrigatório",
      passwordMustBeString: "Senha deve ser do tipo texto",
      passwordInvalid:
        "Senha inválida (mínimo de 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial - !@#$%)",
    },

    employee: {
      nameRequired: "Nome é campo obrigatório",
      nameMustBeString: "Nome deve ser do tipo texto",
      nameTooShort: "Nome é muito curto",
      nameTooLong: "Nome é muito longo",

      cpfRequired: "CPF é campo obrigatório",
      cpfMustBeString: "CPF deve ser do tipo texto",
      cpfInvalid: "CPF inválido",

      dobRequired: "Data de nascimento é campo obrigatório",
      dobInvalid: "Data de nascimento inválida",

      jobTitleRequired: "Cargo é campo obrigatório",
      jobTitleMustBeString: "Cargo deve ser do tipo texto",
      jobTitleTooShort: "Cargo é muito curto",
      jobTitleTooLong: "Cargo é muito longo",
    },

    certificate: {
      employeeIdRequired: "Colaborador é campo obrigatório",
      employeeIdInvalid: "Colaborador inválido",

      issuedAtRequired: "Data de emissão é campo obrigatório",
      issuedAtInvalid: "Data de emissão inválida",

      daysRequired: "Quantidade de dias é campo obrigatório",
      daysInvalid: "Quantidade de dias inválida",

      cidRequired: "CID é campo obrigatório",
      cidMustBeString: "CID deve ser do tipo texto",
      cidMustBeNumericString: "CID deve conter apenas números",

      observationsMustBeString: "Observações devem ser do tipo texto",
      observationsTooLong: "Observações são muito longas",
    },
  },

  domain: {
    userCreation: {
      emailAlreadyInUse: "E-mail já está em uso",
      databaseError: "Erro no banco de dados",
      couldNotCreateUser: "Não foi possível criar o usuário",
    },

    userAuth: {
      logoutError: "Erro ao encerrar a sessão",
      noSession: "Nenhuma sessão encontrada",
    },

    employee: {
      notFound: "Colaborador não encontrado",
      databaseError: "Erro no banco de dados",
    },
    employeeCreation: {
      cpfAlreadyInUse: "CPF já está em uso",
      databaseError: "Erro no banco de dados",
    },
    employeeUpdate: {
      cpfAlreadyInUse: "CPF já está em uso",
      databaseError: "Erro no banco de dados",
      activeInvalid: "Campo 'ativo' inválido",
    },

    certificate: {
      notFound: "Atestado não encontrado",
      databaseError: "Erro no banco de dados",
    },
    certificateCreation: {
      databaseError: "Erro no banco de dados",
      employeeNotFound: "Colaborador não encontrado",
    },
    certificateUpdate: {
      databaseError: "Erro no banco de dados",
    },

    query: {
      qMustBestring: "Parâmetro de busca deve ser do tipo texto",
      pageMustBePositiveNumber: "Página deve ser um número positivo",
      limitMustBePositiveNumber: "Limite deve ser um número positivo",
      limitCannotExceed100: "Limite não pode exceder 100",
    },
    employeeQuery: {
      activeInvalid: "Campo 'ativo' inválido",
    },
    certificateQuery: {
      employeeIdInvalid: "ID de colaborador inválido",
    },

    who: {
      tokenFetchError: "Falha ao obter token",

      searchIsRequired: "Busca é campo obrigatório",
      searchInvalid: "Busca inválida",
      searchResponseInvalid: "Resposta da busca inválida",

      codeIsRequired: "Código é campo obrigatório",
      codeInvalid: "Código inválido",
      codeErrorResponse: "Erro ao consultar código",
    },
  },

  ui: {
    loginFailed: "Falha no login",
  },
} as const;
export type ErrorCodes = typeof ErrorCodes;
