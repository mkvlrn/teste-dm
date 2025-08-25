import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { CertificateForm } from "#/pages/certificates/certificate-form";

export function NewCertificateModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal onClose={close} opened={opened} title="Novo atestado">
        <CertificateForm closemodal={close} />
      </Modal>

      <ActionIcon onClick={open} size="md" title="Adicionar atestado" variant="light">
        <IconPlus className="text-amber-100 bg-dark-900" />
      </ActionIcon>
    </>
  );
}
