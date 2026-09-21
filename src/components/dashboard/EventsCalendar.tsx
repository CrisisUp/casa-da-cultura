"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Evento } from "@/types/models";

export default function EventsCalendar() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/eventos?proximos=true&limit=5")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar eventos");
        return res.json();
      })
      .then((data) => {
        setEventos(data.eventos || data || []);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao carregar eventos:", err);
        setError("Erro ao carregar eventos");
        setLoading(false);
      });
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
      <div className="rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-sm border border-areia dark:border-areia/25 transition-colors">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4 font-[family-name:var(--font-playfair)]">
          Próximos Eventos
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 p-3 rounded-lg bg-areia/20 dark:bg-areia/10">
              <div className="h-16 w-16 rounded bg-areia dark:bg-areia/30" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-areia dark:bg-areia/30 rounded w-1/3" />
                <div className="h-3 bg-areia dark:bg-areia/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-danger/10 p-6 shadow-sm border border-danger/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-danger" />
          <h3 className="text-lg font-semibold text-danger">Erro ao carregar eventos</h3>
        </div>
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-sm border border-areia dark:border-areia/25 text-center transition-colors">
        <Calendar className="h-12 w-12 text-areia dark:text-areia/40 mx-auto mb-3" />
        <p className="text-madeira/60 dark:text-white/70">Nenhum evento próximo cadastrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-sm border border-areia dark:border-areia/25 transition-colors">
      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4 font-[family-name:var(--font-playfair)]">
        Próximos Eventos
      </h3>

      <div className="space-y-3">
        {eventos.slice(0, 5).map((evento) => (
          <div
            key={evento.id}
            className={`rounded-xl p-4 border-l-4 transition-all hover:shadow-md bg-areia/5 dark:bg-[#1f140e] border border-areia/40 dark:border-areia/20 ${
              evento.cor
                ? evento.cor === "bg-terracota"
                  ? "border-l-terracota"
                  : evento.cor === "bg-oliva"
                    ? "border-l-oliva"
                    : evento.cor === "bg-barro"
                      ? "border-l-barro"
                      : evento.cor === "bg-ambar"
                        ? "border-l-ambar"
                        : "border-l-madeira"
                : "border-l-areia"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                {/* Data */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white dark:bg-[#2d1b12] p-2 min-w-16 border border-areia dark:border-areia/30 shadow-xs">
                  <span className="text-xs font-semibold text-madeira dark:text-ambar-light">{formatarMes(String(evento.data))}</span>
                  <span className="text-xl font-extrabold text-terracota">{formatarDia(String(evento.data))}</span>
                </div>

                {/* Detalhes */}
                <div className="flex-1">
                  <h4 className="font-bold text-foreground dark:text-white text-base">{evento.titulo}</h4>
                  <div className="mt-2 space-y-1 text-sm text-madeira/80 dark:text-[#f4ece1]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-terracota-light" />
                      <span>{evento.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-terracota-light" />
                      <span>{evento.local}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
