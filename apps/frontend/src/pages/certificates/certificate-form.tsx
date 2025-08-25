import {
  Button,
  Group,
  NumberInput,
  Paper,
  type PaperProps,
  Radio,
  Select,
  Stack,
} from "@mantine/core";
import type { CertificateEntity } from "@repo/schemas/certificate";
import type { EmployeeEntity } from "@repo/schemas/employee";
import Fuse from "fuse.js";
import { useState } from "react";
import useSwr from "swr";
import { CidSearchByCode } from "#/pages/certificates/inputs/cid-search-by-code";
import { CidSearchByTerm } from "#/pages/certificates/inputs/cid-search-by-term";
import { useCertificateModal } from "#/pages/certificates/use-certificate-modal";
import { fetchEmployeesForCertificate } from "#/utils/api";

interface ModalProps extends PaperProps {
  certificate?: CertificateEntity & { employee: EmployeeEntity };
  closemodal: () => void;
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <explanation>
export function CertificateForm(props: ModalProps) {
  const { form, handleSubmit } = useCertificateModal(props.closemodal, props.certificate);
  const [cidSearchMethod, setCidSearchMethod] = useState<"cid" | "term">("cid");
  const { data: employees } = useSwr("/api/employees", fetchEmployeesForCertificate);

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
        <form
          onReset={form.onReset}
          onSubmit={form.onSubmit(handleSubmit, (err) => console.log(err, form.values))}
        >
          <Stack>
            <Select
              clearable={true}
              data={employees?.map((e) => ({ label: e.name, value: e.id }))}
              error={form.errors["name"] ?? null}
              filter={({ options, search }) => {
                const fuse = new Fuse(options, { keys: ["label", "value"] });
                return search ? fuse.search(search).map((r) => r.item) : options;
              }}
              label="Colaborador"
              onChange={(v) => form.setFieldValue("employeeId", v)}
              placeholder="nome do colaborador"
              radius="md"
              required={true}
              searchable={true}
              value={form.values.employeeId}
            />

            <NumberInput
              label="Dias"
              max={365}
              maxLength={3}
              min={1}
              onChange={(v) => form.setFieldValue("days", Number(v))}
              value={form.values.days}
            />

            <Radio.Group
              className="cursor-pointer"
              label="Forma de busca de sintoma"
              name="cidSearchMethod"
              onChange={(value) => {
                setCidSearchMethod(value as "cid" | "term");
                form.setFieldValue("cid", "");
              }}
              value={cidSearchMethod}
            >
              <Group className="cursor-pointer" mt="xs">
                <Radio className="cursor-pointer" label="CID" value="cid" />
                <Radio className="cursor-pointer" label="Livre" value="term" />
              </Group>
            </Radio.Group>

            <Group>
              <CidSearchByCode
                display={cidSearchMethod === "cid" ? "block" : "none"}
                setValue={(v) => form.setFieldValue("cid", v)}
                value={form.values.cid}
              />
              <CidSearchByTerm
                display={cidSearchMethod === "term" ? "block" : "none"}
                setValue={(v) => form.setFieldValue("cid", v)}
                value={form.values.cid}
              />
            </Group>
          </Stack>

          <Group justify="space-between" mt="xl">
            <Group>
              <Button disabled={Object.keys(form.errors).length > 0} radius="xl" type="submit">
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
