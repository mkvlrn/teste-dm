import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  CreateEmployeeSchema,
  type EmployeeEntity,
  UpdateEmployeeSchema,
} from "@repo/schemas/employee";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { mutate } from "swr";

async function act(
  data: CreateEmployeeSchema | UpdateEmployeeSchema,
  cacheKey: string,
  id?: string,
): Promise<boolean> {
  let url = "";
  let method = "";

  if (id) {
    url = `/api/employees/${id}`;
    method = "PATCH";
  } else {
    url = "/api/employees";
    method = "POST";
  }

  const corrected = { ...data, cpf: data.cpf?.replace(/\D/g, "").slice(0, 11) ?? data.cpf };

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corrected),
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
      title: "Sucesso",
      message: "Colaborador registrado",
    });

    return true;
  } catch (err) {
    notifications.show({
      color: "red",
      withCloseButton: true,
      autoClose: 5000,
      title: "Falha",
      message: `Erro ao registrar colaborador: ${(err as Error).message}`,
    });

    return false;
  } finally {
    mutate(cacheKey);
  }
}

export function useEmployeeModal(cacheKey: string, close: () => void, employee?: EmployeeEntity) {
  const form = useForm({
    initialValues: {
      name: employee?.name ?? "",
      cpf: employee?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") ?? "",
      dateOfBirth: employee
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      jobTitle: employee?.jobTitle ?? "",
      active: employee?.active ?? true,
    },

    validate: employee ? zod4Resolver(UpdateEmployeeSchema) : zod4Resolver(CreateEmployeeSchema),
  });

  async function handleSubmit(data: object) {
    const parsedData = employee
      ? UpdateEmployeeSchema.parse(data)
      : CreateEmployeeSchema.parse(data);
    const ok = employee
      ? await act(parsedData, cacheKey, employee?.id)
      : await act(parsedData, cacheKey);

    if (ok) {
      form.reset();
      close();
    }
  }

  return { form, handleSubmit };
}
