import { ActionIcon, Stack, Textarea, TextInput } from "@mantine/core";
import { IconArrowRight, IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
  display: string;
  value: string;
  setValue: (value: string) => void;
};

export function CidSearchByCode({ display, value, setValue }: Props) {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (value === "") {
      setCode("");
      setText("");
    }
  }, [value]);

  async function fetchCid(code: string) {
    const response = await fetch(`/api/who/code/${code}`);
    const json = await response.json();

    setValue(code);
    setText(json.value);
  }

  return (
    <Stack className="w-full" display={display}>
      <TextInput
        label="CID"
        leftSection={<IconSearch size={18} stroke={1.5} />}
        onChange={(event) => {
          setCode(event.currentTarget.value);
          value && setValue("");
        }}
        placeholder="2027526159"
        required={display === "block"}
        rightSection={
          <ActionIcon
            color="gray"
            onClick={async () => await fetchCid(code)}
            radius="xl"
            size={18}
            variant="outline"
          >
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>
        }
        value={code}
      />

      <Textarea
        readOnly={true}
        rightSection={
          text ? (
            <IconCheck color="green" size={18} stroke={1.5} />
          ) : (
            <IconX color="red" size={18} stroke={1.5} />
          )
        }
        value={text ?? ""}
      />
    </Stack>
  );
}
