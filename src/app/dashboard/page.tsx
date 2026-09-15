import { prisma } from "@/lib/prisma";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalArtistas, ativos, inativos, porGenero] = await Promise.all([
    prisma.artista.count(),
    prisma.artista.count({ where: { status: "ATIVO" } }),
    prisma.artista.count({ where: { status: "INATIVO" } }),
    prisma.artista.groupBy({
      by: ["generoArtistico"],
      _count: true,
      orderBy: { _count: { generoArtistico: "desc" } },
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Visão geral do cadastro de artistas</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Charts data={chartData} />
      </div>
    </div>
  );
}
