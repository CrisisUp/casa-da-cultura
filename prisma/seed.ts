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

  // Criar depoimentos de exemplo
  const depoimentos = [
    {
      nome: "Maria Silva",
      genero: "Música",
      texto: "A Casa da Cultura transformou minha carreira. Hoje sou cantora profissional graças às oportunidades que recebi aqui.",
      avatar: "MS",
      ativo: true,
      ordem: 1,
    },
    {
      nome: "João Santos",
      genero: "Dança",
      texto: "O cadastro no sistema me conectou com outros artistas e abriu portas para participar de eventos culturais.",
      avatar: "JS",
      ativo: true,
      ordem: 2,
    },
    {
      nome: "Ana Oliveira",
      genero: "Artes Visuais",
      texto: "Ter minha arte reconhecida e poder compartilhar com a comunidade é uma experiência incrível.",
      avatar: "AO",
      ativo: true,
      ordem: 3,
    },
  ];

  for (const depoimento of depoimentos) {
    const exists = await prisma.depoimento.findFirst({
      where: { nome: depoimento.nome },
    });
    if (!exists) {
      await prisma.depoimento.create({ data: depoimento });
    }
  }

  // Criar eventos de exemplo (datas relativas a hoje)
  const hoje = new Date();
  const eventos = [
    {
      titulo: "Festival de Música",
      descricao: "Apresentações musicais de artistas locais",
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 5),
      hora: "19:00",
      local: "Auditório Principal",
      tipo: "Música",
      cor: "bg-terracota",
      ativo: true,
    },
    {
      titulo: "Mostra de Artes Visuais",
      descricao: "Exposição de pinturas e esculturas",
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 12),
      hora: "10:00",
      local: "Galeria de Arte",
      tipo: "Artes Visuais",
      cor: "bg-ambar",
      ativo: true,
    },
    {
      titulo: "Peça Teatral",
      descricao: "Apresentação da peça 'A Herança dos Artistas'",
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 18),
      hora: "20:00",
      local: "Teatro Municipal",
      tipo: "Teatro",
      cor: "bg-barro",
      ativo: true,
    },
    {
      titulo: "Oficina de Dança",
      descricao: "Aula aberta de dança contemporânea",
      data: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 25),
      hora: "14:00",
      local: "Estúdio de Dança",
      tipo: "Dança",
      cor: "bg-oliva",
      ativo: true,
    },
  ];

  for (const evento of eventos) {
    const exists = await prisma.evento.findFirst({
      where: { titulo: evento.titulo },
    });
    if (!exists) {
      await prisma.evento.create({ data: evento });
    }
  }

  console.log("Seed concluído!");
  console.log("Usuários criados:");
  console.log("  Admin: admin@casa.gov.br / admin123");
  console.log("  Operador: operador@casa.gov.br / operador123");
  console.log(`${artistas.length} artistas de exemplo criados`);
  console.log(`${depoimentos.length} depoimentos de exemplo criados`);
  console.log(`${eventos.length} eventos de exemplo criados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
