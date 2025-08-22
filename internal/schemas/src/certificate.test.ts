import { assert, test } from "vitest";
import { CreateCertificateSchema } from "#/certificate";

const certificate: CreateCertificateSchema = {
  issuedAt: "2025-01-01T00:00:00.000Z",
  employeeId: "cuid12345",
  days: 10,
  cid: "1234567890",
  observations: "lost 4 teeth in a bar fight",
};

test("parses a valid certificate", () => {
  const parse = CreateCertificateSchema.safeParse(certificate);

  assert.isTrue(parse.success);
});
