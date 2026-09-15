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
  Shuffle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/dashboard/StatsCards";
import Charts from "@/components/dashboard/Charts";
import GenreCards from "@/components/dashboard/GenreCards";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import PhotoGallery from "@/components/dashboard/PhotoGallery";
import Testimonials from "@/components/dashboard/Testimonials";
import EventsCalendar from "@/components/dashboard/EventsCalendar";
import HeroFeatured from "@/components/dashboard/HeroFeatured";
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

interface Destaque {
  id: string;
  nome: string;
  generoArtistico: string;
  foto: string | null;
  experienciaArtistica: string | null;
}

interface DashboardContentProps {
  totalArtistas: number;
  ativos: number;
  inativos: number;
  porGenero: Array<{ generoArtistico: string; _count: number }>;
  recentes: Artista[];
  destaque: Destaque | null;
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
  destaque,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const router = useRouter();

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

  function artistaAleatorio() {
    if (recentes.length === 0) return;
    const random = recentes[Math.floor(Math.random() * recentes.length)];
    router.push(`/dashboard/artistas/${random.id}`);
  }

  return (
    <div className="space-y-10">
      {/* Hero + Botão surpresa */}
      <AnimatedCard delay={0}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HeroFeatured artista={destaque} />
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={artistaAleatorio}
              className="group flex flex-1 items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-terracota via-barro to-madeira p-6 text-white transition-all duration-300 hover:shadow-xl hover:shadow-terracota/20 hover:scale-[1.02]"
            >
              <Shuffle className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
              <div className="text-left">
                <p className="text-lg font-bold font-[family-name:var(--font-playfair)]">
                  Artista Aleatório
                </p>
                <p className="text-sm text-white/70">
                  Clique para descobrir
                </p>
              </div>
            </button>
            <div className="flex-1 rounded-3xl bg-gradient-to-br from-areia to-creme p-6 border border-areia">
              <WelcomeBanner />
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Alerta */}
      {totalArtistas < 10 && (
        <AnimatedCard delay={100}>
          <AlertBanner
            variant="warning"
            title="Poucos artistas cadastrados"
            message="O sistema está com poucos registros. Cadastre mais artistas para ter dados mais completos nos relatórios."
          />
        </AnimatedCard>
      )}

      {/* Stats */}
      <AnimatedCard delay={200}>
        <StatsCards stats={stats} />
      </AnimatedCard>

      {/* Tabs */}
      <AnimatedCard delay={300}>
        <Tabs tabs={tabs} defaultTab="visao-geral" onChange={setActiveTab}>
          {activeTab === "visao-geral" && (
            <div className="space-y-10">
              {/* Gêneros */}
              <section>
                <GenreCards counts={genreCounts} />
              </section>

              {/* Galeria + Gráfico (layout assimétrico) */}
              <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <PhotoGallery artistas={recentes} />
                </div>
                <div className="lg:col-span-2">
                  <Charts data={chartData} />
                </div>
              </section>

              {/* Eventos + Recentes */}
              <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <EventsCalendar />

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
                      Cadastros Recentes
                    </h3>
                    <Link
                      href="/dashboard/artistas"
                      className="text-sm text-terracota hover:text-terracota-dark font-medium"
                    >
                      Ver todos →
                    </Link>
                  </div>
                  {recentes.length === 0 ? (
                    <p className="text-madeira/60 text-center py-8">
                      Nenhum artista cadastrado ainda
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentes.slice(0, 5).map((artista) => (
                        <Link
                          key={artista.id}
                          href={`/dashboard/artistas/${artista.id}`}
                          className="flex items-center gap-3 rounded-xl p-3 hover:bg-areia/30 transition-all duration-300 group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracota/10 text-terracota font-semibold text-sm overflow-hidden group-hover:scale-105 transition-transform">
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
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-terracota transition-colors">
                              {artista.nome}
                            </p>
                            <p className="text-xs text-madeira/60">
                              {artista.generoArtistico}
                            </p>
                          </div>
                          <Badge
                            variant={artista.status === "ATIVO" ? "success" : "danger"}
                          >
                            {artista.status}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Depoimentos */}
              <section>
                <Testimonials />
              </section>
            </div>
          )}

          {activeTab === "recentes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
                  Últimos Artistas Cadastrados
                </h3>
                <Link
                  href="/dashboard/artistas/novo"
                  className="inline-flex items-center gap-2 rounded-xl bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-dark transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Novo Artista
                </Link>
              </div>

              {recentes.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-areia">
                  <Users className="h-12 w-12 text-madeira/30 mx-auto mb-4" />
                  <p className="text-madeira/60">
                    Nenhum artista cadastrado ainda
                  </p>
                  <Link
                    href="/dashboard/artistas/novo"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-terracota px-4 py-2 text-sm font-medium text-white hover:bg-terracota-dark transition-colors"
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
                      className="group rounded-2xl bg-white p-4 shadow-sm border border-areia hover:shadow-md hover:border-terracota/20 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracota/10 text-terracota font-bold text-lg overflow-hidden group-hover:scale-105 transition-transform">
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
                          <p className="font-semibold text-foreground truncate group-hover:text-terracota transition-colors">
                            {artista.nome}
                          </p>
                          <p className="text-sm text-madeira/60">
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
