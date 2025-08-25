import { Select, Stack, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";

type Props = {
  display: string;
  value: string;
  setValue: (value: string) => void;
};

export function CidSearchByTerm({ display, value, setValue }: Props) {
  const [term, setTerm] = useDebouncedState("", 0);
  const [termResults, setTermResults] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function fetchCid() {
      const response = await fetch(`/api/who/search?q=${term}`);
      const json = await response.json();

      setTermResults(
        json.value.map((j: { id: string; title: string }) => ({
          label: j.title,
          value: j.id,
        })),
      );
    }

    if (term.length > 0) {
      fetchCid();
    }
  }, [term]);

  useEffect(() => {
    if (value === "") {
      setTerm("");
    }
  }, [value]);

  return (
    <Stack className="w-full" display={display}>
      <Select
        clearable={true}
        data={termResults}
        filter={({ options, search }) => {
          const fuse = new Fuse(options, { keys: ["label", "value"] });
          return search ? fuse.search(search).map((r) => r.item) : options;
        }}
        label="Termo"
        leftSection={<IconSearch size={18} stroke={1.5} />}
        onChange={(v) => setValue(v ?? "")}
        onSearchChange={setTerm}
        placeholder="tosse"
        radius="md"
        required={display === "block"}
        searchable={true}
        searchValue={term}
        value={value}
      />

      <TextInput
        readOnly={true}
        rightSection={
          value ? (
            <IconCheck color="green" size={18} stroke={1.5} />
          ) : (
            <IconX color="red" size={18} stroke={1.5} />
          )
        }
        value={value ?? ""}
      />
    </Stack>
  );
}
