import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({ error: "Erro interno ao remover depoimento" }, { status: 500 });
  }
}