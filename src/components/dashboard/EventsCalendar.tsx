"use client";

import { Calendar, MapPin, Clock } from "lucide-react";

const eventos = [
  {
    id: 1,
    titulo: "Festival de Música",
    data: "2024-12-15",
    hora: "19:00",
    local: "Auditório Principal",
    tipo: "Música",
    cor: "bg-terracota",
  },
  {
    id: 2,
    titulo: "Mostra de Artes Visuais",
    data: "2024-12-20",
    hora: "10:00",
    local: "Galeria de Arte",
    tipo: "Artes Visuais",
    cor: "bg-ambar",
  },
  {
    id: 3,
    titulo: "Peça Teatral",
    data: "2024-12-22",
    hora: "20:00",
    local: "Teatro Municipal",
    tipo: "Teatro",
    cor: "bg-barro",
  },
  {
    id: 4,
    titulo: "Oficina de Dança",
    data: "2024-12-28",
    hora: "14:00",
    local: "Estúdio de Dança",
    tipo: "Dança",
    cor: "bg-oliva",
  },
];

export default function EventsCalendar() {
  function formatarData(data: string) {
    const date = new Date(data + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  function formatarDia(data: string) {
    const date = new Date(data + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { day: "2-digit" });
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-terracota" />
        <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          Próximos Eventos
        </h3>
      </div>

      <div className="space-y-3">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="flex items-start gap-4 rounded-xl p-3 hover:bg-areia/30 transition-colors"
          >
            {/* Data */}
            <div className={`flex flex-col items-center justify-center rounded-xl ${evento.cor} text-white px-3 py-2 min-w-[60px]`}>
              <span className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                {formatarDia(evento.data)}
              </span>
              <span className="text-xs uppercase opacity-90">
                {formatarData(evento.data).split(" ")[1]}
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
            </div>

            {/* Tipo */}
            <span className="inline-flex items-center rounded-full bg-areia px-2 py-1 text-xs font-medium text-madeira">
              {evento.tipo}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button className="text-sm text-terracota hover:text-terracota-dark font-medium">
          Ver todos os eventos →
        </button>
      </div>
    </div>
  );
}
