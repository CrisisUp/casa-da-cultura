import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const artista = await prisma.artista.update({
      where: { id },
      data: {
        nome: body.nome,
        cpf: body.cpf?.replace(/\D/g, ""),
        rg: body.rg,
        telefone: body.telefone?.replace(/\D/g, ""),
        email: body.email,
        endereco: body.endereco,
        dataNascimento: body.dataNascimento
          ? new Date(body.dataNascimento)
          : undefined,
        escolaridade: body.escolaridade,
        experienciaArtistica: body.experienciaArtistica,
        redesSociais: body.redesSociais,
        observacoes: body.observacoes,
        generoArtistico: body.generoArtistico,
        foto: body.foto,
        status: body.status,
      },
    });

    return NextResponse.json(artista);
  } catch (error: unknown) {
    if (error instanceof Error && (error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "CPF já cadastrado" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar artista" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.artista.delete({ where: { id } });
  return NextResponse.json({ message: "Artista removido" });
}
