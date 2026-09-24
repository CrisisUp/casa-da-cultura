import { handleApiError } from "@/lib/api-response";
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

    return NextResponse.json({ success: true, data: depoimento });
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
  console.log("🔵 [PUT /api/depoimentos] Rota chamada");

  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
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

    console.log("✅ [PUT] Atualizado:", depoimento.id);
    return NextResponse.json({ success: true, data: depoimento });
  } catch (error) {
    return handleApiError(error, "atualizar depoimento");
  }
}

// ─────────────────────────────────────────────
// DELETE /api/depoimentos/[id]  (mantido como está)
// ─────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔵 [DELETE /api/depoimentos] Rota chamada");

  try {
    const session = await auth();
    console.log("🔵 [DELETE] Session:", session?.user?.email, "Role:", session?.user?.role);

    if (!session || session.user?.role !== "ADMIN") {
      console.log("🔴 [DELETE] Acesso negado. Role:", session?.user?.role);
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    console.log("🔵 [DELETE] ID recebido:", id);

    const depoimento = await prisma.depoimento.findUnique({ where: { id } });
    console.log("🔵 [DELETE] Depoimento encontrado:", depoimento ? depoimento.id : "NÃO ENCONTRADO");

    if (!depoimento) {
      console.log("🔴 [DELETE] Depoimento não existe com esse ID");
      return NextResponse.json({ error: "Depoimento não encontrado" }, { status: 404 });
    }

    console.log("🟡 [DELETE] Executando prisma.depoimento.delete...");
    const removido = await prisma.depoimento.delete({ where: { id } });
    console.log("✅ [DELETE] Removido com sucesso! ID:", removido.id, "Nome:", removido.nome);

    return NextResponse.json({ message: "Depoimento removido com sucesso" });
  } catch (error) {
    console.error("❌ [DELETE] Erro capturado:", error);
    if (error instanceof Error) {
      console.error("❌ [DELETE] Mensagem:", error.message);
      console.error("❌ [DELETE] Stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Erro interno ao remover depoimento" },
      { status: 500 }
    );
  }
}