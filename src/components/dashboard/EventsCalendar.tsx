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

  function formatarData(data: string) {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

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
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
          Próximos Eventos
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 p-3 rounded-lg bg-areia/20">
              <div className="h-16 w-16 rounded bg-areia" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-areia rounded w-1/3" />
                <div className="h-3 bg-areia rounded w-1/2" />
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
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia text-center">
        <Calendar className="h-12 w-12 text-areia mx-auto mb-3" />
        <p className="text-madeira/60">Nenhum evento próximo cadastrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia">
      <h3 className="text-lg font-semibold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
        Próximos Eventos
      </h3>

      <div className="space-y-3">
        {eventos.slice(0, 5).map((evento) => (
          <div
            key={evento.id}
            className={`rounded-xl p-4 border-l-4 transition-all hover:shadow-md ${
              evento.cor
                ? evento.cor === "bg-terracota"
                  ? "border-l-terracota bg-terracota/5"
                  : evento.cor === "bg-oliva"
                    ? "border-l-oliva bg-oliva/5"
                    : evento.cor === "bg-barro"
                      ? "border-l-barro bg-barro/5"
                      : evento.cor === "bg-ambar"
                        ? "border-l-ambar bg-ambar/5"
                        : "border-l-madeira bg-madeira/5"
                : "border-l-areia bg-areia/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                {/* Data */}
                <div className="flex flex-col items-center justify-center rounded-lg bg-white p-2 min-w-16 border border-areia">
                  <span className="text-xs font-medium text-madeira/60">{formatarMes(String(evento.data))}</span>
                  <span className="text-xl font-bold text-terracota">{formatarDia(String(evento.data))}</span>
                </div>

                {/* Detalhes */}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{evento.titulo}</h4>
                  <div className="mt-2 space-y-1 text-sm text-madeira/70">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {evento.hora}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {evento.local}
                    </div>
                    {evento.artistaId && (
                      <div className="text-xs text-terracota font-medium">
                        Com: Artista ID {evento.artistaId}
                      </div>
                    )}
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
