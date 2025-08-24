import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Burger hiddenFrom="sm" onClick={toggle} opened={opened} size="sm" />
        <div>Logo</div>
      </AppShell.Header>
      <AppShell.Navbar>Navbar</AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
