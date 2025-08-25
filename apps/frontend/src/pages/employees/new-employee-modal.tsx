import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { EmployeeForm } from "#/pages/employees/employee-form";

export function NewEmployeeModal({ cacheKey }: { cacheKey: string }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal onClose={close} opened={opened} title="Novo colaborador">
        <EmployeeForm cacheKey={cacheKey} close={close} />
      </Modal>

      <ActionIcon onClick={open} size="md" title="Adicionar colaborador" variant="light">
        <IconPlus className="text-amber-100 bg-dark-900" />
      </ActionIcon>
    </>
  );
}
