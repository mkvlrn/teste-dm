import { useEffect } from "react";
import useSwr from "swr";
import { useLocation } from "wouter";

export function useLogout() {
  const { data: user, mutate } = useSwr("/api/auth/me");
  const [_, navigate] = useLocation();

  useEffect(() => {
    async function doLogout() {
      await logout();
      await mutate();
      navigate("/");
    }

    doLogout();
  }, [user]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  }

  return { user };
}
