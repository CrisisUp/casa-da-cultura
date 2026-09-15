import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get("all") === "true";
  const proximos = searchParams.get("proximos") === "true";

  const where: any = {};

  if (!all) {
    where.ativo = true;
  }

  if (proximos) {
    where.data = { gte: new Date() };
  }

  const eventos = await prisma.evento.findMany({
    where,
    include: { artista: { select: { id: true, nome: true } } },
    orderBy: { data: "asc" },
  });

  return NextResponse.json(eventos);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const evento = await prisma.evento.create({
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        data: new Date(body.data),
        hora: body.hora,
        local: body.local,
        tipo: body.tipo,
        cor: body.cor,
        artistaId: body.artistaId || null,
        ativo: body.ativo ?? true,
      },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar evento" },
      { status: 500 }
    );
  }
}
