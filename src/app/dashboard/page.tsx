import { prisma } from "@/lib/prisma";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";
import GenreCards from "@/components/dashboard/GenreCards";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

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

  const stats = [
    {
      title: "Total de Artistas",
      value: totalArtistas,
      icon: Users,
      color: "bg-primary",
    },
    {
      title: "Ativos",
      value: ativos,
      icon: UserCheck,
      color: "bg-success",
    },
    {
      title: "Inativos",
      value: inativos,
      icon: UserX,
      color: "bg-danger",
    },
    {
      title: "Gêneros Cadastrados",
      value: porGenero.length,
      icon: TrendingUp,
      color: "bg-secondary",
    },
  ];

  const chartData = porGenero.map((item) => ({
    name: item.generoArtistico,
    value: item._count,
  }));

  const genreCounts: Record<string, number> = {};
  porGenero.forEach((item) => {
    genreCounts[item.generoArtistico] = item._count;
  });

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <StatsCards stats={stats} />

      <GenreCards counts={genreCounts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Charts data={chartData} />

        {/* Cadastros recentes */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Cadastros Recentes
          </h3>
          {recentes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum artista cadastrado ainda
            </p>
          ) : (
            <div className="space-y-3">
              {recentes.map((artista) => (
                <div
                  key={artista.id}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {artista.foto ? (
                      <img
                        src={artista.foto}
                        alt={artista.nome}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      artista.nome.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {artista.nome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {artista.generoArtistico}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      artista.status === "ATIVO"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {artista.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
