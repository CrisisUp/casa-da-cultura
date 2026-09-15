"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  LayoutDashboard,
  Clock,
  Plus,
} from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";
import GenreCards from "@/components/dashboard/GenreCards";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import PhotoGallery from "@/components/dashboard/PhotoGallery";
import Testimonials from "@/components/dashboard/Testimonials";
import EventsCalendar from "@/components/dashboard/EventsCalendar";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Badge from "@/components/ui/Badge";
import AlertBanner from "@/components/ui/AlertBanner";
import Tabs from "@/components/ui/Tabs";

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

const tabs = [
  { id: "visao-geral", label: "Visão Geral", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "recentes", label: "Recentes", icon: <Clock className="h-4 w-4" /> },
];

export default function DashboardContent({
  totalArtistas,
  ativos,
  inativos,
  porGenero,
  recentes,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("visao-geral");

  const stats = [
    {
      title: "Total de Artistas",
      value: totalArtistas,
      icon: Users,
      color: "bg-terracota",
    },
    {
      title: "Ativos",
      value: ativos,
      icon: UserCheck,
      color: "bg-oliva",
    },
    {
      title: "Inativos",
      value: inativos,
      icon: UserX,
      color: "bg-barro",
    },
    {
      title: "Gêneros Cadastrados",
      value: porGenero.length,
      icon: TrendingUp,
      color: "bg-ambar",
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
      {/* Alerta importante */}
      {totalArtistas < 10 && (
        <AnimatedCard delay={0}>
          <AlertBanner
            variant="warning"
            title="Poucos artistas cadastrados"
            message="O sistema está com poucos registros. Cadastre mais artistas para ter dados mais completos nos relatórios."
          />
        </AnimatedCard>
      )}

      <AnimatedCard delay={100}>
        <WelcomeBanner />
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <StatsCards stats={stats} />
      </AnimatedCard>

      {/* Tabs */}
      <AnimatedCard delay={300}>
        <Tabs tabs={tabs} defaultTab="visao-geral" onChange={setActiveTab}>
          {/* Visão Geral */}
          {activeTab === "visao-geral" && (
            <div className="space-y-6">
              <GenreCards counts={genreCounts} />

              <PhotoGallery artistas={recentes} />

              <Testimonials />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <EventsCalendar />

                {/* Cadastros recentes compacto */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cadastros Recentes
                    </h3>
                    <Link
                      href="/dashboard/artistas"
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Ver todos →
                    </Link>
                  </div>
                  {recentes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum artista cadastrado ainda
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentes.slice(0, 4).map((artista) => (
                        <div
                          key={artista.id}
                          className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 transition-all duration-300"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm overflow-hidden">
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
              </div>
            </div>
          )}

          {/* Recentes */}
          {activeTab === "recentes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Últimos Artistas Cadastrados
                </h3>
                <Link
                  href="/dashboard/artistas/novo"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Novo Artista
                </Link>
              </div>

              {recentes.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nenhum artista cadastrado ainda
                  </p>
                  <Link
                    href="/dashboard/artistas/novo"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Cadastrar primeiro artista
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentes.map((artista) => (
                    <Link
                      key={artista.id}
                      href={`/dashboard/artistas/${artista.id}`}
                      className="group rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg overflow-hidden group-hover:scale-105 transition-transform">
                          {artista.foto ? (
                            <img
                              src={artista.foto}
                              alt={artista.nome}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                          ) : (
                            artista.nome.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {artista.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {artista.generoArtistico}
                          </p>
                        </div>
                        <Badge
                          variant={artista.status === "ATIVO" ? "success" : "danger"}
                        >
                          {artista.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </AnimatedCard>
    </div>
  );
}
