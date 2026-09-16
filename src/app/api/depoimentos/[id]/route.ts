import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { depoimentoSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (error) {
    console.error("Erro ao buscar depoimento:", error);
    return NextResponse.json(
      { error: "Erro ao buscar depoimento" },
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
    const validated = depoimentoSchema.parse(body);

    const depoimento = await prisma.depoimento.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(depoimento);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: (error as any).errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar depoimento:", error);
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
  try {
    const { id } = await params;

    const depoimento = await prisma.depoimento.findUnique({ where: { id } });
    if (!depoimento) {
      return NextResponse.json(
        { error: "Depoimento não encontrado" },
        { status: 404 }
      );
    }

    await prisma.depoimento.delete({ where: { id } });
    console.log(`[AUDIT] Depoimento deletado: ${id}`);

    return NextResponse.json({ message: "Depoimento removido" });
  } catch (error) {
    console.error("Erro ao deletar depoimento:", error);
    return NextResponse.json(
      { error: "Erro ao remover depoimento" },
      { status: 500 }
    );
  }
}
