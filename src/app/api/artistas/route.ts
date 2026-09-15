import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const genero = searchParams.get("genero") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = {};

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

    const artista = await prisma.artista.create({
      data: {
        nome: body.nome,
        cpf: body.cpf.replace(/\D/g, ""),
        rg: body.rg,
        telefone: body.telefone.replace(/\D/g, ""),
        email: body.email,
        endereco: body.endereco,
        dataNascimento: body.dataNascimento
          ? new Date(body.dataNascimento)
          : null,
        escolaridade: body.escolaridade,
        experienciaArtistica: body.experienciaArtistica,
        redesSociais: body.redesSociais,
        observacoes: body.observacoes,
        generoArtistico: body.generoArtistico,
        foto: body.foto,
      },
    });

    return NextResponse.json(artista, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "CPF já cadastrado" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar artista" },
      { status: 500 }
    );
  }
}
