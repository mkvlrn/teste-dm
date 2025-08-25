import { useDebouncedState } from "@mantine/hooks";
import { useLayoutEffect, useRef, useState } from "react";
import useSwr from "swr";
import { fetchEmployeess } from "#/utils/api";

export function useEmployees() {
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<"all" | "true" | "false">("all");
  const [q, setQ] = useDebouncedState("", 800);
  const {
    data: employees,
    error,
    isLoading,
  } = useSwr(`/api/employees?q=${q}&page=${page}&active=${active}`, fetchEmployeess);
  const filterRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (employees?.data) {
      filterRef.current?.focus();
    }
  });

  return { page, setPage, active, setActive, q, setQ, employees, error, isLoading, filterRef };
}
