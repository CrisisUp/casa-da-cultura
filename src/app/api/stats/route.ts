import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { STATUS_VALUES } from "@/lib/constants";
import { formatResponse, handleApiError } from "@/lib/api-response";

const [STATUS_ATIVO, STATUS_INATIVO] = STATUS_VALUES;

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const [total, ativos, inativos, porGenero, recentes] = await Promise.all([
      prisma.artista.count({ where: { deletedAt: null } }),
      prisma.artista.count({ where: { status: STATUS_ATIVO, deletedAt: null } }),
      prisma.artista.count({ where: { status: STATUS_INATIVO, deletedAt: null } }),
      prisma.artista.groupBy({
        by: ["generoArtistico"],
        where: { deletedAt: null },
        _count: true,
        orderBy: { _count: { generoArtistico: "desc" } },
      }),
      prisma.artista.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, nome: true, generoArtistico: true, status: true, createdAt: true },
      }),
    ]);

    return NextResponse.json(
      formatResponse({
        total,
        ativos,
        inativos,
        porGenero: porGenero.map((g) => ({
          genero: g.generoArtistico,
          count: g._count,
        })),
        recentes,
      })
    );
  } catch (error) {
    return handleApiError(error, "buscar estatísticas");
  }
}
