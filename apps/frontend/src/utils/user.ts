import useSwr from "swr";
import { fetchUser } from "#/utils/api";

export function useAuth() {
  const { data: user, mutate } = useSwr("/api/auth/me", fetchUser);

  return { user, mutate };
}
