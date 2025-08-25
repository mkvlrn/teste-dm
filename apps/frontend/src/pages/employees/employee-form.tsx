import { Button, Checkbox, Group, Paper, type PaperProps, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { EmployeeEntity } from "@repo/schemas/employee";
import { useEmployeeModal } from "#/pages/employees/use-employee-modal";

interface ModalProps extends PaperProps {
  employee?: EmployeeEntity;
  cachekey: string;
  closemodal: () => void;
}

export function EmployeeForm(props: ModalProps) {
  const { form, handleSubmit } = useEmployeeModal(props.cachekey, props.closemodal, props.employee);

  return (
    <div className="flex justify-center">
      <Paper
        m="lg={true}"
        p="lg"
        radius="md"
        w={{ base: "100%", md: "400px" }}
        withBorder={true}
        {...props}
      >
        <form onReset={form.onReset} onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              error={form.errors["name"] ?? null}
              label="Nome"
              onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
              placeholder="nome do colaborador"
              radius="md"
              required={true}
              value={form.values.name}
            />

            <TextInput
              error={form.errors["cpf"] ?? null}
              label="CPF"
              onChange={(event) => {
                let v = event.target.value.replace(/\D/g, "").slice(0, 11);
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                form.setFieldValue("cpf", v);
              }}
              placeholder="000.000.000-00"
              radius="md"
              required={true}
              value={form.values.cpf}
            />

            <TextInput
              error={form.errors["jobTitle"] ?? null}
              label="Cargo"
              onChange={(event) => form.setFieldValue("jobTitle", event.currentTarget.value)}
              placeholder="cargo do colaborador"
              radius="md"
              required={true}
              type="tel"
              value={form.values.jobTitle}
            />

            <DatePickerInput
              error={form.errors["dateOfBirth"] ?? null}
              label="Data de nascimento"
              // @ts-expect-error
              onChange={(v) => form.setFieldValue("dateOfBirth", v)}
              radius="md"
              required={true}
              value={form.values.dateOfBirth!}
            />

            {props.employee && (
              <Checkbox
                checked={form.values.active}
                label="Ativo"
                onChange={(event) => form.setFieldValue("active", event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Group>
              <Button radius="xl" type="submit">
                OK
              </Button>
              <Button color="red" radius="xl" type="reset">
                Limpar
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
