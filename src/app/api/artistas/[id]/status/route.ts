import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (status !== "ATIVO" && status !== "INATIVO") {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // Se o artista for inativado, removemos o status de destaque dele
    const updateData: { status: "ATIVO" | "INATIVO"; destaque?: boolean } = { status };
    if (status === "INATIVO") {
      updateData.destaque = false;
    }

    const artista = await prisma.artista.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, artista });
  } catch (error) {
    return handleApiError(error, "atualizar status do artista");
  }
}
