import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Suspense } from "react";
import { useLocation } from "wouter";
import { usePages } from "#/app/use-pages";
import { Header } from "#/components/header/header";
import { Loading } from "#/components/loading/loading";
import { Navbar } from "#/components/navbar/navbar";
import { NotFound } from "#/pages/not-found/not-found";

export function App() {
  const [opened, { toggle }] = useDisclosure();
  const [location] = useLocation();
  const { pages } = usePages();

  const Page = pages.get(location);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Burger hiddenFrom="sm" onClick={toggle} opened={opened} size="sm" />
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Suspense fallback={<Loading />}>{Page ? <Page /> : <NotFound />}</Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
