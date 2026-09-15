import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@casa.gov.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@casa.gov.br",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Criar usuário operador
  const operatorPassword = await bcrypt.hash("operador123", 10);
  const operator = await prisma.user.upsert({
    where: { email: "operador@casa.gov.br" },
    update: {},
    create: {
      name: "Operador",
      email: "operador@casa.gov.br",
      password: operatorPassword,
      role: "OPERATOR",
    },
  });

  // Criar artistas de exemplo
  const artistas: Array<{
    nome: string;
    cpf: string;
    telefone: string;
    generoArtistico: string;
    status: "ATIVO" | "INATIVO";
    rg?: string;
    email?: string;
    endereco?: string;
    dataNascimento?: Date;
    escolaridade?: string;
    experienciaArtistica?: string;
    redesSociais?: string;
  }> = [
    {
      nome: "Maria Silva Santos",
      cpf: "12345678901",
      rg: "1234567",
      telefone: "11999887766",
      email: "maria.santos@email.com",
      endereco: "Rua das Flores, 123 - Centro",
      dataNascimento: new Date("1985-03-15"),
      escolaridade: "Superior Completo",
      experienciaArtistica: "Cantora e compositora há 20 anos. Participa de corais e shows culturais.",
      redesSociais: "@maria.cantora",
      generoArtistico: "Música",
      status: "ATIVO",
    },
    {
      nome: "João Pedro Oliveira",
      cpf: "23456789012",
      telefone: "11988776655",
      generoArtistico: "Dança",
      experienciaArtistica: "Dançarino de dança contemporânea. Participa do grupo Expressão Corporal.",
      status: "ATIVO",
    },
    {
      nome: "Ana Carolina Souza",
      cpf: "34567890123",
      telefone: "11977665544",
      email: "ana.souza@email.com",
      generoArtistico: "Teatro",
      experienciaArtistica: "Atriz e diretora teatral. Monta peças para a comunidade há 10 anos.",
      status: "ATIVO",
    },
    {
      nome: "Carlos Eduardo Lima",
      cpf: "45678901234",
      telefone: "11966554433",
      generoArtistico: "Artes Visuais",
      experienciaArtistica: "Pintor e escultor. Expõe suas obras em galerias locais.",
      status: "ATIVO",
    },
    {
      nome: "Fernanda Costa",
      cpf: "56789012345",
      telefone: "11955443322",
      generoArtistico: "Literatura",
      experienciaArtistica: "Poetisa e contista. Publicou 3 livros de poesia.",
      status: "INATIVO",
    },
    {
      nome: "Roberto Almeida",
      cpf: "67890123456",
      telefone: "11944332211",
      generoArtistico: "Artesanato",
      experienciaArtistica: "Artesão especializado em cerâmica e barro. Ensina oficinas para a comunidade.",
      status: "ATIVO",
    },
  ];

  for (const artista of artistas) {
    await prisma.artista.upsert({
      where: { cpf: artista.cpf },
      update: {},
      create: artista,
    });
  }

  console.log("Seed concluído!");
  console.log("Usuários criados:");
  console.log("  Admin: admin@casa.gov.br / admin123");
  console.log("  Operador: operador@casa.gov.br / operador123");
  console.log(`${artistas.length} artistas de exemplo criados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
