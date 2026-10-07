import { handleApiError, formatResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { artistaSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artista = await prisma.artista.findUnique({
      where: { id },
    });

    if (!artista) {
      return NextResponse.json(
        { error: "Artista não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(artista);
  } catch (error) {
    console.error("Erro ao buscar artista:", error);
    return NextResponse.json(
      { error: "Erro ao buscar artista" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = artistaSchema.parse(body);

    const artista = await prisma.artista.update({
      where: { id },
      data: {
        nome: validated.nome,
        cpf: validated.cpf?.replace(/\D/g, ""),
        rg: validated.rg || undefined,
        telefone: validated.telefone?.replace(/\D/g, ""),
        email: validated.email || undefined,
        endereco: validated.endereco || undefined,
        dataNascimento: validated.dataNascimento
          ? new Date(validated.dataNascimento)
          : undefined,
        escolaridade: validated.escolaridade || undefined,
        experienciaArtistica: validated.experienciaArtistica || undefined,
        redesSociais: validated.redesSociais || undefined,
        observacoes: validated.observacoes || undefined,
        generoArtistico: validated.generoArtistico,
        foto: validated.foto || undefined,
      },
    });

    return NextResponse.json(formatResponse(artista));
  } catch (error) {
    return handleApiError(error, "atualizar artista");
  }
}

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

    const artista = await prisma.artista.findUnique({ where: { id } });
    if (!artista) {
      return NextResponse.json(
        { error: "Artista não encontrado" },
        { status: 404 }
      );
    }

    await prisma.artista.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    console.log(`[AUDIT] Artista deletado (soft): ${id} (${artista.nome})`);

    return NextResponse.json(formatResponse({ message: "Artista removido" }));
  } catch (error) {
    console.error("Erro ao deletar artista:", error);
    return NextResponse.json(
      { error: "Erro ao remover artista" },
      { status: 500 }
    );
  }
}