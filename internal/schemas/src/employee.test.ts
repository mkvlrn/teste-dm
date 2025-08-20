import { assert, test } from "vitest";
import { CreateEmployeeSchema } from "#/employee";

const employee: CreateEmployeeSchema = {
  name: "John Doe",
  cpf: "170.317.641-30",
  dateOfBirth: "1990-01-01",
  jobTitle: "Software Engineer",
};

test("parses a valid employee", () => {
  const parse = CreateEmployeeSchema.safeParse(employee);

  assert.isTrue(parse.success);
});
