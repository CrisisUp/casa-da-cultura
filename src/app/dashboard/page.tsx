import { prisma } from "@/lib/prisma";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalArtistas, ativos, inativos, porGenero, recentes] = await Promise.all([
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
      select: {
        id: true,
        nome: true,
        generoArtistico: true,
        status: true,
        foto: true,
      },
    }),
  ]);

  return (
    <DashboardContent
      totalArtistas={totalArtistas}
      ativos={ativos}
      inativos={inativos}
      porGenero={porGenero}
      recentes={recentes}
    />
  );
}
