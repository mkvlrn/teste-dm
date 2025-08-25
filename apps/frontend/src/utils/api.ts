import type { CertificateEntity } from "@repo/schemas/certificate";
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

export type CertificatesResult = {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  data: (CertificateEntity & { employee: EmployeeEntity })[];
};

export async function fetchCertificates(url: string): Promise<CertificatesResult> {
  const response = await fetch(url);
  const data = await response.json();

  return data as CertificatesResult;
}

export async function fetchEmployeesForCertificate(
  url: string,
): Promise<{ name: string; id: string }[]> {
  const allData: { name: string; id: string }[] = [];
  let currentPage = 1;
  let totalPages: number;

  do {
    const response = await fetch(`${url}?&page=${currentPage}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data at page ${currentPage}`);
    }

    const result: EmployeesResult = await response.json();
    totalPages = result.totalPages;

    allData.push(...result.data.map((employee) => ({ name: employee.name, id: employee.id })));

    currentPage++;
  } while (currentPage <= totalPages);

  return allData;
}
