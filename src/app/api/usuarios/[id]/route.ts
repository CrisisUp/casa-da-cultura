import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-response";

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

    // Evitar que o admin delete a si mesmo
    if (session.user?.id === id) {
      return NextResponse.json({ error: "Você não pode deletar seu próprio usuário administrador" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    return handleApiError(error, "remover usuário");
  }
}
