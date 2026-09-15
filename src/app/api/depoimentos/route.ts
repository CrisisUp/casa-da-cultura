import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get("all") === "true";

  const where = all ? {} : { ativo: true };

  const depoimentos = await prisma.depoimento.findMany({
    where,
    orderBy: { ordem: "asc" },
  });

  return NextResponse.json(depoimentos);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const depoimento = await prisma.depoimento.create({
      data: {
        nome: body.nome,
        genero: body.genero,
        texto: body.texto,
        avatar: body.avatar,
        ativo: body.ativo ?? true,
        ordem: body.ordem ?? 0,
      },
    });

    return NextResponse.json(depoimento, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar depoimento" },
      { status: 500 }
    );
  }
}
