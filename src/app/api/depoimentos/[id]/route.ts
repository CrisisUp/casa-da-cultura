import { handleApiError, formatResponse } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { depoimentoSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// GET /api/depoimentos/[id]
// ─────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const depoimento = await prisma.depoimento.findUnique({ where: { id } });

    if (!depoimento) {
      return NextResponse.json(
        { success: false, error: "Depoimento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(formatResponse(depoimento));
  } catch (error) {
    return handleApiError(error, "buscar depoimento");
  }
}

// ─────────────────────────────────────────────
// PUT /api/depoimentos/[id]
// ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = depoimentoSchema.parse(body);

    const depoimento = await prisma.depoimento.update({
      where: { id },
      data: validated,
    });

    console.log(`[AUDIT] Depoimento atualizado: ${id}`);
    return NextResponse.json(formatResponse(depoimento));
  } catch (error) {
    return handleApiError(error, "atualizar depoimento");
  }
}

// ─────────────────────────────────────────────
// DELETE /api/depoimentos/[id]
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;

    const depoimento = await prisma.depoimento.findUnique({ where: { id } });

    if (!depoimento) {
      return NextResponse.json({ error: "Depoimento não encontrado" }, { status: 404 });
    }

    // Soft delete: marcar como deletado em vez de remover do DB
    const removido = await prisma.depoimento.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    console.log(`[AUDIT] Depoimento deletado (soft): ${removido.id}`);

    return NextResponse.json(formatResponse({ message: "Depoimento removido com sucesso" }));
  } catch (error) {
    console.error("[ERROR] ao remover depoimento:", error);
    return NextResponse.json(
      { error: "Erro interno ao remover depoimento" },
      { status: 500 }
    );
  }
}