import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createUser() {
  const email = process.argv[2] || "novo@casa.gov.br";
  const password = process.argv[3] || "senha123";
  const name = process.argv[4] || "Novo Usuário";

  // Validate role
  const roleArg = process.argv[5];
  const role = roleArg && (roleArg === "ADMIN" || roleArg === "OPERATOR")
    ? roleArg
    : "OPERATOR";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  console.log(`✓ Usuário criado:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Role: ${user.role}`);
}

createUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());