import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json(
      { error: "Erro ao buscar evento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = eventoSchema.parse(body);

    const evento = await prisma.evento.update({
      where: { id },
      data: {
        ...validated,
        data: new Date(validated.data),
      },
    });

    return NextResponse.json(evento);
  } catch (error) {
    return handleApiError(error, "atualizar evento");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    await prisma.evento.delete({ where: { id } });
    console.log(`[AUDIT] Evento deletado: ${id} (${evento.titulo})`);

    return NextResponse.json({ message: "Evento removido" });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return NextResponse.json(
      { error: "Erro ao remover evento" },
      { status: 500 }
    );
  }
}
