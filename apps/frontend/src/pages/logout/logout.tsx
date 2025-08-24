import { Button, Text } from "@mantine/core";
import { useLogout } from "#/pages/logout/use-logout";
import { Unauthorized } from "#/pages/unauthorized/unauthorized";

export function Logout() {
  const { user, handleLogout } = useLogout();

  return user?.email ? (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3">
        <Text size="xl">Logout</Text>
        <Button onClick={handleLogout}>Confirma?</Button>
      </div>
    </div>
  ) : (
    <Unauthorized />
  );
}
