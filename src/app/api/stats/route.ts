import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, ativos, inativos, porGenero, recentes] = await Promise.all([
    prisma.artista.count(),
    prisma.artista.count({ where: { status: "ATIVO" } }),
    prisma.artista.count({ where: { status: "INATIVO" } }),
    prisma.artista.groupBy({
      by: ["generoArtistico"],
      _count: true,
      orderBy: { _count: { generoArtistico: "desc" } },
    }),
    prisma.artista.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, nome: true, generoArtistico: true, status: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    total,
    ativos,
    inativos,
    porGenero: porGenero.map((g) => ({
      genero: g.generoArtistico,
      count: g._count,
    })),
    recentes,
  });
}
