import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { artistaSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const genero = searchParams.get("genero") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { nome: { contains: search, mode: "insensitive" } },
      { cpf: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (genero) {
    where.generoArtistico = genero;
  }

  if (status) {
    where.status = status;
  }

  const [artistas, total] = await Promise.all([
    prisma.artista.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.artista.count({ where }),
  ]);

  return NextResponse.json({
    artistas,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = artistaSchema.parse(body);

    const artista = await prisma.artista.create({
      data: {
        nome: validated.nome,
        cpf: validated.cpf.replace(/\D/g, ""),
        rg: validated.rg || undefined,
        telefone: validated.telefone.replace(/\D/g, ""),
        email: validated.email || undefined,
        endereco: validated.endereco || undefined,
        dataNascimento: validated.dataNascimento
          ? new Date(validated.dataNascimento)
          : null,
        escolaridade: validated.escolaridade || undefined,
        experienciaArtistica: validated.experienciaArtistica || undefined,
        redesSociais: validated.redesSociais || undefined,
        observacoes: validated.observacoes || undefined,
        generoArtistico: validated.generoArtistico,
        foto: validated.foto || undefined,
      },
    });

    return NextResponse.json(artista, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ((error as any).code === "P2002") {
        return NextResponse.json(
          { error: "CPF já cadastrado" },
          { status: 400 }
        );
      }
      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Dados inválidos", details: (error as any).errors },
          { status: 400 }
        );
      }
    }
    console.error("Erro ao criar artista:", error);
    return NextResponse.json(
      { error: "Erro ao criar artista" },
      { status: 500 }
    );
  }
}
