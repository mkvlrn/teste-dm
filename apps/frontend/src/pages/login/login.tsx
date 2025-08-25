import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  type PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { PageContainer } from "#/components/page-container/page-container";
import { useLogin } from "#/pages/login/use-login";

export function Login(props: PaperProps) {
  const { form, type, toggle, handleSubmit } = useLogin();

  return (
    <PageContainer title="Hey!">
      <div className="w-full flex flex-row justify-center">
        <Paper
          m="lg"
          p="lg"
          radius="md"
          w={{ base: "100%", md: "400px" }}
          withBorder={true}
          {...props}
        >
          <Text className="mb-2" fw={500} size="lg">
            {type} com seu email
          </Text>

          <form onReset={form.onReset} onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              {type === "registre" && (
                <TextInput
                  error={form.errors["name"] ?? null}
                  label="Nome"
                  onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                  placeholder="seu nome"
                  radius="md"
                  required={true}
                  value={form.values.name}
                />
              )}

              <TextInput
                error={form.errors["email"] ?? null}
                label="Email"
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                placeholder="admin@admin.com"
                radius="md"
                required={true}
                value={form.values.email}
              />

              <PasswordInput
                error={form.errors["password"] ?? null}
                label="Senha"
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                placeholder="sua senha"
                radius="md"
                required={true}
                value={form.values.password}
              />

              {type === "register" && (
                <Checkbox
                  checked={form.values.terms}
                  label="I accept terms and conditions"
                  onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
                />
              )}
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                c="dimmed"
                component="button"
                onClick={() => toggle()}
                size="xs"
                type="button"
              >
                {type === "registre" ? "Já tem conta? Faça o login" : "Não tem conta? Se registre"}
              </Anchor>
              <Group>
                <Button radius="xl" type="submit">
                  {upperFirst(type)}
                </Button>
                <Button color="red" radius="xl" type="reset">
                  Limpar
                </Button>
              </Group>
            </Group>
          </form>
        </Paper>
      </div>
    </PageContainer>
  );
}
