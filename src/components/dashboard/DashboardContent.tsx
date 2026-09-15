"use client";

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";
import GenreCards from "@/components/dashboard/GenreCards";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Badge from "@/components/ui/Badge";

interface Artista {
  id: string;
  nome: string;
  generoArtistico: string;
  status: "ATIVO" | "INATIVO";
  foto: string | null;
}

interface DashboardContentProps {
  totalArtistas: number;
  ativos: number;
  inativos: number;
  porGenero: Array<{ generoArtistico: string; _count: number }>;
  recentes: Artista[];
}

export default function DashboardContent({
  totalArtistas,
  ativos,
  inativos,
  porGenero,
  recentes,
}: DashboardContentProps) {
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
      <AnimatedCard delay={0}>
        <WelcomeBanner />
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <StatsCards stats={stats} />
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <GenreCards counts={genreCounts} />
      </AnimatedCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatedCard delay={300}>
          <Charts data={chartData} />
        </AnimatedCard>

        <AnimatedCard delay={400}>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
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
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm overflow-hidden">
                      {artista.foto ? (
                        <img
                          src={artista.foto}
                          alt={artista.nome}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        artista.nome.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {artista.nome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {artista.generoArtistico}
                      </p>
                    </div>
                    <Badge
                      variant={artista.status === "ATIVO" ? "success" : "danger"}
                    >
                      {artista.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
