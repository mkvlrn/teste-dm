import { assert, test } from "vitest";
import { CreateUserSchema } from "#/user";

const user: CreateUserSchema = {
  name: "John Doe",
  email: "john.doe@email.com",
  password: "@ValidPassword123",
};

test("parses a valid user", () => {
  const parse = CreateUserSchema.safeParse(user);

  assert.isTrue(parse.success);
});
