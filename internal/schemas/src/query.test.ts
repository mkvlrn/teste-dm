import { assert, describe, test } from "vitest";
import { CertificateQuerySchema, EmployeeQuerySchema } from "#/query";

describe("EmployeeQuerySchema", () => {
  test("should validate a valid employee query", () => {
    const validQuery = {
      q: "search term",
      page: 2,
      limit: 20,
      active: "true",
    };

    const result = EmployeeQuerySchema.safeParse(validQuery);

    assert.isTrue(result.success);
    assert.deepStrictEqual(result.data, validQuery as EmployeeQuerySchema);
  });

  test("should reject an invalid employee query", () => {
    const invalidQuery = {
      page: -1,
      limit: 150,
      active: "invalid",
      extraField: "not allowed",
    };

    const result = EmployeeQuerySchema.safeParse(invalidQuery);

    assert.isFalse(result.success);
  });
});

describe("CertificateQuerySchema", () => {
  test("should validate a valid certificate query", () => {
    const validQuery = {
      q: "certificate search",
      page: 1,
      limit: 50,
      employeeId: "emp-123",
    };

    const result = CertificateQuerySchema.safeParse(validQuery);

    assert.isTrue(result.success);
    assert.deepStrictEqual(result.data, validQuery as CertificateQuerySchema);
  });

  test("should reject an invalid certificate query", () => {
    const invalidQuery = {
      page: 0,
      limit: 101,
      employeeId: 123,
      unexpectedField: "value",
    };

    const result = CertificateQuerySchema.safeParse(invalidQuery);

    assert.isFalse(result.success);
  });
});
