"use client";

import { Evento } from "@/types/models";
import { AlertCircle, Calendar, Clock, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function EventsCalendar() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/eventos?proximos=true&limit=5", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar eventos");
        return res.json();
      })
      .then((data) => {
        // ✅ Verificação explícita (evita bug com array vazio)
        setEventos(Array.isArray(data) ? data : data.eventos ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Erro ao carregar eventos:", err);
        setError("Erro ao carregar eventos");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  function formatarDia(data: string) {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", { day: "2-digit" });
  }

  function formatarMes(data: string) {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", { month: "short" });
  }

  if (loading) {
    return (
      <section className="cultural-card" aria-label="Próximos Eventos - Carregando">
        <h3 className="cultural-section-title mb-4">Próximos Eventos</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 p-3 rounded-lg bg-subtle border border-border"
            >
              <div className="h-16 w-16 rounded bg-areia/50 dark:bg-areia/20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-areia/50 dark:bg-areia/20 rounded w-1/3" />
                <div className="h-3 bg-areia/50 dark:bg-areia/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="cultural-card bg-danger/10 border-danger/20"
        aria-label="Erro ao carregar eventos"
      >
        <header className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-danger" />
          <h3 className="cultural-section-title text-danger">
            Erro ao carregar eventos
          </h3>
        </header>
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </section>
    );
  }

  if (eventos.length === 0) {
    return (
      <section
        className="cultural-card text-center"
        aria-label="Nenhum evento próximo"
      >
        <Calendar className="h-12 w-12 text-areia dark:text-areia/40 mx-auto mb-3" />
        <p className="text-madeira/60 dark:text-white/70">
          Nenhum evento próximo cadastrado
        </p>
      </section>
    );
  }

  return (
    <section className="cultural-card" aria-label="Próximos Eventos">
      <header className="mb-4">
        <h3 className="cultural-section-title">Próximos Eventos</h3>
      </header>

      <div className="space-y-3">
        {eventos.slice(0, 5).map((evento) => (
          <article
            key={evento.id}
            className={`rounded-xl p-4 border-l-4 transition-all hover:shadow-md bg-surface border border-border ${
              evento.cor === "bg-terracota"
                ? "border-l-terracota"
                : evento.cor === "bg-oliva"
                  ? "border-l-oliva"
                  : evento.cor === "bg-barro"
                    ? "border-l-barro"
                    : evento.cor === "bg-ambar"
                      ? "border-l-ambar"
                      : "border-l-madeira"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                {/* Data */}
                <time
                  dateTime={String(evento.data)}
                  className="flex flex-col items-center justify-center rounded-lg bg-subtle p-2 min-w-16 border border-border shadow-xs"
                >
                  <span className="text-xs font-semibold text-madeira dark:text-ambar">
                    {formatarMes(String(evento.data))}
                  </span>
                  <span className="text-xl font-extrabold text-terracota">
                    {formatarDia(String(evento.data))}
                  </span>
                </time>

                {/* Detalhes */}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-base">
                    {evento.titulo}
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-terracota" />
                      <span>{evento.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-terracota" />
                      <span>{evento.local}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}