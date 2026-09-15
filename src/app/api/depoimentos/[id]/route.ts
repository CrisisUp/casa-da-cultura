import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const depoimento = await prisma.depoimento.findUnique({
    where: { id },
  });

  if (!depoimento) {
    return NextResponse.json(
      { error: "Depoimento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(depoimento);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const depoimento = await prisma.depoimento.update({
      where: { id },
      data: {
        nome: body.nome,
        genero: body.genero,
        texto: body.texto,
        avatar: body.avatar,
        ativo: body.ativo,
        ordem: body.ordem,
      },
    });

    return NextResponse.json(depoimento);
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar depoimento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.depoimento.delete({ where: { id } });
  return NextResponse.json({ message: "Depoimento removido" });
}
