import type { EmployeeEntity } from "@repo/schemas/employee";
import type { UserEntity } from "@repo/schemas/user";

export async function fetchUser(url: string): Promise<UserEntity> {
  const response = await fetch(url);
  const data = await response.json();

  return data.user as UserEntity;
}

export type EmployeesResult = {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  data: EmployeeEntity[];
};

export async function fetchEmployeess(url: string): Promise<EmployeesResult> {
  const response = await fetch(url);
  const data = await response.json();

  return data as EmployeesResult;
}
