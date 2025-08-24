import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ErrorCodes } from "@repo/error-codes";
import { CreateUserSchema, LoginSchema } from "@repo/schemas/user";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { mutate } from "swr";
import { useLocation } from "wouter";

async function act(data: CreateUserSchema | LoginSchema, type: string): Promise<boolean> {
  let url: string;

  if (type === "entre") {
    url = "/api/auth/login";
  } else if (type === "registre") {
    url = "/api/auth/register";
  } else {
    throw new Error(`Invalid type: ${type}`);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    notifications.show({
      color: "green",
      withCloseButton: true,
      autoClose: 5000,
      title: "Olá!",
      message: "Login efetuado com sucesso",
    });

    return true;
  } catch (err) {
    notifications.show({
      color: "red",
      withCloseButton: true,
      autoClose: 5000,
      title: ErrorCodes.ui.loginFailed,
      message: (err as Error).message,
    });

    return false;
  }
}

export function useLogin() {
  const [type, toggle] = useToggle(["entre", "registre"]);
  const [_, navigate] = useLocation();
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: type === "registre" ? zod4Resolver(CreateUserSchema) : zod4Resolver(LoginSchema),
  });

  async function handleSubmit(data: object) {
    form.reset();
    const ok = await act(
      type === "registre" ? CreateUserSchema.parse(data) : LoginSchema.parse(data),
      type,
    );
    await mutate("/api/auth/me");

    if (ok) {
      navigate("/");
    }
  }

  function handleError(error: unknown) {
    console.log("yooo", error);
  }

  return { form, type, toggle, handleSubmit, handleError };
}
