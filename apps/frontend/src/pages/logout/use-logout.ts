import { notifications } from "@mantine/notifications";
import { useLocation } from "wouter";
import { useAuth } from "#/utils/user";

export function useLogout() {
  const { user, mutate } = useAuth();
  const [_, navigate] = useLocation();

  async function handleLogout() {
    if (user?.email) {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      notifications.show({
        color: "green",
        withCloseButton: true,
        autoClose: 5000,
        title: "Até!",
        message: "Logout efetuado com sucesso",
      });
      await mutate();
      navigate("/");
    }
  }

  return { user, handleLogout };
}
