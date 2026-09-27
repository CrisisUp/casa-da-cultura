import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatResponse, handleApiError } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;

    // Transação atômica para garantir consistência
    const [_, artista] = await prisma.$transaction([
      prisma.artista.updateMany({
        data: { destaque: false },
      }),
      prisma.artista.update({
        where: { id },
        data: { destaque: true },
      }),
    ]);

    return NextResponse.json(formatResponse(artista));
  } catch (error) {
    return handleApiError(error, "definir artista em destaque");
  }
}
