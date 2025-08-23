/** biome-ignore-all lint/suspicious/noConsole: cli */
/** biome-ignore-all lint/correctness/noNodejsModules: utility */
import process from "node:process";
import { faker } from "@faker-js/faker";
import { generate } from "@fnando/cpf";
import type { CreateCertificateSchema } from "@repo/schemas/certificate";
import type { CreateEmployeeSchema } from "@repo/schemas/employee";
import { PrismaClient } from "#/generated/prisma/client";
import { auth } from "#/shared/utils/auth";

const howManyEmployees = 100;
const inactivePercent = 0.2;
const withCertificatePercent = 0.3;
const prisma = new PrismaClient();

// drop all
try {
  await prisma.$runCommandRaw({ delete: "verification", deletes: [{ q: {}, limit: 0 }] });
  await prisma.$runCommandRaw({ delete: "user", deletes: [{ q: {}, limit: 0 }] });
  await prisma.$runCommandRaw({ delete: "employee", deletes: [{ q: {}, limit: 0 }] });
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

// create admin
await auth.api.signUpEmail({
  body: {
    name: "admin",
    email: "admin@admin.com",
    password: "admin",
  },
});

// create employees
const employees: CreateEmployeeSchema[] = [];
for (let i = 0; i < howManyEmployees; i++) {
  employees.push({
    name: faker.person.fullName(),
    cpf: generate(false),
    dateOfBirth: faker.date.between({ from: "1970-01-01", to: "2000-01-01" }).toISOString(),
    jobTitle: faker.person.jobTitle(),
  });
}
await prisma.employee.createMany({ data: employees });
const createdEmployees = await prisma.employee.findMany();
const inactiveEmployeesCount = Math.floor(createdEmployees.length * inactivePercent);
const shuffledEmployees = [...createdEmployees].sort(() => Math.random() - 0.5);
const employeesToDeactivate = shuffledEmployees.slice(0, inactiveEmployeesCount);
await prisma.employee.updateMany({
  where: { id: { in: employeesToDeactivate.map((e) => e.id) } },
  data: { active: false },
});

// create certificates
const certificates: CreateCertificateSchema[] = [];
const withCertificateCount = Math.floor(createdEmployees.length * withCertificatePercent);
const secondShuffle = [...createdEmployees].sort(() => Math.random() - 0.5);
const employeesWithCertificate = secondShuffle.slice(0, withCertificateCount);
for (const employee of employeesWithCertificate) {
  const certificateCount = faker.number.int({ min: 1, max: 3 });
  for (let i = 0; i < certificateCount; i++) {
    certificates.push({
      employeeId: employee.id,
      days: faker.number.int({ min: 1, max: 365 }),
      cid: faker.string.numeric({ length: 7 }),
      observations: faker.lorem.words({ min: 0, max: 5 }),
    });
  }
}
await prisma.certificate.createMany({ data: certificates });

console.info("ok");
