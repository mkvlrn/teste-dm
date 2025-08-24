import { notifications } from "@mantine/notifications";
import useSwr from "swr";
import { useLocation } from "wouter";
import { fetchUser } from "#/utils/api";

export function useLogout() {
  const { data: user, mutate } = useSwr("/api/auth/me", fetchUser);
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
