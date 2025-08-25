import { Pagination, ScrollArea, SegmentedControl, Table } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import useSwr from "swr";
import { Loading } from "#/components/loading/loading";
import { PageContainer } from "#/components/page-container/page-container";
import { EditEmployeeModal } from "#/pages/colaboradores/edit-employee-modal";
import { NewEmployeeModal } from "#/pages/colaboradores/new-employee-modal";
import { Unauthorized } from "#/pages/unauthorized/unauthorized";
import { fetchEmployeess } from "#/utils/api";
import { useAuth } from "#/utils/user";

export function Colaboradores() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<"all" | "true" | "false">("all");
  const {
    data: employees,
    error,
    isLoading,
  } = useSwr(`/api/employees?page=${page}&active=${active}`, fetchEmployeess);

  if (!user?.email) {
    return <Unauthorized />;
  }

  if (error) {
    return <div>error</div>;
  }

  if (!employees?.data) {
    return <Loading />;
  }

  const rows = employees.data.map((e) => (
    <Table.Tr key={e.id}>
      <Table.Td>{e.name}</Table.Td>
      <Table.Td>{e.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</Table.Td>
      <Table.Td>{e.jobTitle}</Table.Td>
      <Table.Td>{new Date(e.dateOfBirth).toLocaleDateString()}</Table.Td>
      <Table.Td>{e.active ? <IconCheck /> : <IconX />}</Table.Td>
      <Table.Td>
        <EditEmployeeModal cacheKey={`/api/employees?page=${page}&active=${active}`} employee={e} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <PageContainer title="Colaboradores">
      <div className="flex flex-col items-center my-2 gap-4">
        <Pagination onChange={setPage} total={employees?.totalPages} value={page} />
        <SegmentedControl
          data={[
            { label: "Todos", value: "all" },
            { label: "Ativos", value: "true" },
            { label: "Inativos", value: "false" },
          ]}
          onChange={(value) => setActive(value as "all" | "true" | "false")}
          value={active}
        />
      </div>
      <NewEmployeeModal cacheKey={`/api/employees?page=${page}&active=${active}`} />
      {isLoading && <Loading />}
      {!isLoading && (
        <ScrollArea>
          <Table miw={800}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>CPF</Table.Th>
                <Table.Th>Cargo</Table.Th>
                <Table.Th>Nascimento</Table.Th>
                <Table.Th>Ativo</Table.Th>
                <Table.Th>Edição</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </PageContainer>
  );
}
