import { assert, test } from "vitest";
import { CreateCertificateSchema } from "#/certificate";

const certificate: CreateCertificateSchema = {
  employeeId: "cuid12345",
  days: 10,
  cid: "1234567890",
  observations: "lost 4 teeth in a bar fight",
};

test("parses a valid certificate", () => {
  const parse = CreateCertificateSchema.safeParse(certificate);

  assert.isTrue(parse.success);
});
