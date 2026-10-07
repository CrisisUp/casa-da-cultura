import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { STATUS_VALUES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const [STATUS_ATIVO, STATUS_INATIVO] = STATUS_VALUES;

export default async function DashboardPage() {
  // Verificar autenticação no servidor
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [totalArtistas, ativos, inativos, porGenero, recentes, destaqueManual, destaqueFallback] = await Promise.all([
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
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        generoArtistico: true,
        status: true,
        foto: true,
        destaque: true,
      },
    }),
    prisma.artista.findFirst({
      where: { status: STATUS_ATIVO, destaque: true, deletedAt: null },
      select: {
        id: true,
        nome: true,
        generoArtistico: true,
        foto: true,
        experienciaArtistica: true,
      },
    }),
    prisma.artista.findFirst({
      where: { status: STATUS_ATIVO, foto: { not: null }, deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        generoArtistico: true,
        foto: true,
        experienciaArtistica: true,
      },
    }),
  ]);

  const destaque = destaqueManual || destaqueFallback;

  return (
    <DashboardContent
      totalArtistas={totalArtistas}
      ativos={ativos}
      inativos={inativos}
      porGenero={porGenero}
      recentes={recentes}
      destaque={destaque}
    />
  );
}
