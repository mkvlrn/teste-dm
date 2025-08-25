import { Pagination, ScrollArea, Table, TextInput } from "@mantine/core";
import { Loading } from "#/components/loading/loading";
import { PageContainer } from "#/components/page-container/page-container";
import { NewCertificateModal } from "#/pages/certificates/new-certificate-modal";
import { useCertificates } from "#/pages/certificates/use-certificates";
import { Unauthorized } from "#/pages/unauthorized/unauthorized";
import { useAuth } from "#/utils/user";

export function Certificates() {
  const { user } = useAuth();
  const { certificates, error, isLoading, page, setPage, q, setQ, filterRef } = useCertificates();

  if (!user?.email) {
    return <Unauthorized />;
  }

  if (error) {
    return <div>error</div>;
  }

  if (!certificates?.data) {
    return <Loading />;
  }

  const rows = certificates.data.map((c) => (
    <Table.Tr key={c.id}>
      <Table.Td>{c.employee.name}</Table.Td>
      <Table.Td>{new Date(c.issuedAt).toLocaleDateString()}</Table.Td>
      <Table.Td>{c.days}</Table.Td>
      <Table.Td>{c.cid}</Table.Td>
      <Table.Td>{c.observations}</Table.Td>
    </Table.Tr>
  ));

  return (
    <PageContainer title="Atestados">
      <div className="flex flex-col items-center my-2 gap-4">
        <Pagination onChange={setPage} total={certificates?.totalPages} value={page} />
        <TextInput
          defaultValue={q}
          label="Filtro (Colaborador, CID, Observações)"
          onChange={(event) => setQ(event.currentTarget.value)}
          ref={filterRef}
        />
      </div>
      <NewCertificateModal />
      {isLoading && <Loading />}
      {!isLoading && (
        <ScrollArea>
          <Table miw={800}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Colaborador</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Dias</Table.Th>
                <Table.Th>CID</Table.Th>
                <Table.Th>Observações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </PageContainer>
  );
}
