import type { UserEntity } from "@repo/schemas/user";

export async function fetchUser(url: string): Promise<UserEntity> {
  const response = await fetch(url);
  const data = await response.json();

  return data.user as UserEntity;
}
