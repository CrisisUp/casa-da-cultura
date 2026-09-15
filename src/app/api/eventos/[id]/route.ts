import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const evento = await prisma.evento.findUnique({
    where: { id },
    include: { artista: { select: { id: true, nome: true } } },
  });

  if (!evento) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(evento);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const evento = await prisma.evento.update({
      where: { id },
      data: {
        titulo: body.titulo,
        descricao: body.descricao,
        data: body.data ? new Date(body.data) : undefined,
        hora: body.hora,
        local: body.local,
        tipo: body.tipo,
        cor: body.cor,
        artistaId: body.artistaId || null,
        ativo: body.ativo,
      },
    });

    return NextResponse.json(evento);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.evento.delete({ where: { id } });
  return NextResponse.json({ message: "Evento removido" });
}
