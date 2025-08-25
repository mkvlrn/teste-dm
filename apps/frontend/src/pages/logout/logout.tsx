import { Button } from "@mantine/core";
import { PageContainer } from "#/components/page-container/page-container";
import { useLogout } from "#/pages/logout/use-logout";
import { Unauthorized } from "#/pages/unauthorized/unauthorized";

export function Logout() {
  const { user, handleLogout } = useLogout();

  return user?.email ? (
    <PageContainer title="Logout">
      <div className="w-full flex justify-center mx-auto">
        <Button onClick={handleLogout}>Confirma?</Button>
      </div>
    </PageContainer>
  ) : (
    <Unauthorized />
  );
}
