import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { EmployeeEntity } from "@repo/schemas/employee";
import { IconEdit } from "@tabler/icons-react";
import { EmployeeForm } from "#/pages/colaboradores/employee-form";

export function EditEmployeeModal({
  employee,
  cacheKey,
}: {
  employee: EmployeeEntity;
  cacheKey: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal onClose={close} opened={opened} title={`Editar ${employee.name} `}>
        <EmployeeForm cacheKey={cacheKey} close={close} employee={employee} />
      </Modal>

      <ActionIcon onClick={open} size="xs" variant="outline">
        <IconEdit color="white" />
      </ActionIcon>
    </>
  );
}
