"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  tipo: string;
  cor: string | null;
  artista: { id: string; nome: string } | null;
}

export default function EventsCalendar() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        setEventos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            Próximos Eventos
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="h-16 w-[70px] rounded-xl bg-areia" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-areia rounded w-3/4" />
                <div className="h-3 bg-areia rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-areia">
      {/* Imagem de fundo sutil */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: "url(/images.jpeg)" }}
      />
      <div className="relative bg-white/95 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            Próximos Eventos
          </h3>
        </div>

      {eventos.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-madeira/30 mx-auto mb-4" />
          <p className="text-madeira/60">
            Nenhum evento programado
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.slice(0, 5).map((evento) => (
            <div
              key={evento.id}
              className="flex items-start gap-4 rounded-xl p-3 hover:bg-areia/30 transition-colors"
            >
              {/* Data */}
              <div className={`flex flex-col items-center justify-center rounded-xl ${evento.cor || "bg-terracota"} text-white px-3 py-2 min-w-[60px]`}>
                <span className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                  {formatarDia(evento.data)}
                </span>
                <span className="text-xs uppercase opacity-90">
                  {formatarMes(evento.data)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm">
                  {evento.titulo}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-madeira/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {evento.hora}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {evento.local}
                  </span>
                </div>
                {evento.artista && (
                  <p className="text-xs text-terracota mt-1">
                    Artista: {evento.artista.nome}
                  </p>
                )}
              </div>

              {/* Tipo */}
              <span className="inline-flex items-center rounded-full bg-areia px-2 py-1 text-xs font-medium text-madeira">
                {evento.tipo}
              </span>
            </div>
          ))}
        </div>
      )}

      {eventos.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-terracota hover:text-terracota-dark font-medium">
            Ver todos os eventos →
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
