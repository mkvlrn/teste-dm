import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type CertificateEntity, CreateCertificateSchema } from "@repo/schemas/certificate";
import type { EmployeeEntity } from "@repo/schemas/employee";
import { zod4Resolver } from "mantine-form-zod-resolver";

async function act(data: CreateCertificateSchema): Promise<boolean> {
  try {
    const response = await fetch("/api/certificates", {
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
      title: "Sucesso",
      message: "Atestado registrado",
    });

    return true;
  } catch (err) {
    notifications.show({
      color: "red",
      withCloseButton: true,
      autoClose: 5000,
      title: "Falha",
      message: `Erro ao registrar atestado: ${(err as Error).message}`,
    });

    return false;
  }
}

export function useCertificateModal(
  close: () => void,
  certificate?: CertificateEntity & { employee: EmployeeEntity },
) {
  const form = useForm({
    initialValues: {
      employeeId: certificate?.employee.name ?? "",
      days: certificate?.days ?? 1,
      cid: certificate?.cid ?? "",
      observations: certificate?.observations ?? "",
    },

    validate: zod4Resolver(CreateCertificateSchema),
  });

  async function handleSubmit(data: object) {
    const ok = await act(CreateCertificateSchema.parse(data));

    if (ok) {
      form.reset();
      close();
    }
  }

  return { form, handleSubmit };
}
