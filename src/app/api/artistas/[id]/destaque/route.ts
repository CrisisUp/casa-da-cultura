import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-response";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Remove destaque de todos os artistas
    await prisma.artista.updateMany({
      data: { destaque: false },
    });

    // Define o novo destaque
    const artista = await prisma.artista.update({
      where: { id },
      data: { destaque: true },
    });

    return NextResponse.json({ success: true, artista });
  } catch (error) {
    return handleApiError(error, "definir artista em destaque");
  }
}
