import { useLayoutEffect, useRef, useState } from "react";
import useSwr from "swr";
import { fetchCertificates } from "#/utils/api";

export function useCertificates() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const {
    data: certificates,
    error,
    isLoading,
  } = useSwr(`/api/certificates?q=${q}&page=${page}&employeeId=${employeeId}`, fetchCertificates);
  const filterRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (certificates?.data) {
      filterRef.current?.focus();
    }
  });

  return {
    page,
    setPage,
    q,
    setQ,
    employeeId,
    setEmployeeId,
    certificates,
    error,
    isLoading,
    filterRef,
  };
}
