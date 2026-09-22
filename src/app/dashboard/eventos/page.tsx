"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  tipo: string;
  cor: string | null;
  ativo: boolean;
  artista: { id: string; nome: string } | null;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    const res = await fetch("/api/eventos?all=true");
    const data = await res.json();
    setEventos(data.eventos || data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Evento removido!");
      fetchEventos();
    } else {
      toast.error("Erro ao remover evento");
    }
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    const res = await fetch(`/api/eventos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !ativo }),
    });
    if (res.ok) {
      toast.success(ativo ? "Evento desativado" : "Evento ativado");
      fetchEventos();
    }
  }

  function formatarData(data: string) {
    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">
            Eventos
          </h2>
          <p className="text-madeira/70 dark:text-areia/70">
            {eventos.length} evento{eventos.length !== 1 ? "s" : ""} cadastrado{eventos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/eventos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="cultural-card p-12 text-center">
          <p className="text-madeira/60 dark:text-areia/70">Carregando...</p>
        </div>
      ) : eventos.length === 0 ? (
        <div className="cultural-card p-12 text-center">
          <Calendar className="h-12 w-12 text-madeira/30 dark:text-areia/40 mx-auto mb-4" />
          <p className="text-madeira/60 dark:text-areia/70 mb-4">Nenhum evento cadastrado</p>
          <Link href="/dashboard/eventos/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro evento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <article
              key={evento.id}
              className={`cultural-card p-4 transition-all ${
                !evento.ativo ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Data */}
                <div className={`flex flex-col items-center justify-center rounded-xl ${evento.cor || "bg-terracota"} text-white px-3 py-2 min-w-[70px]`}>
                  <span className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                    {new Date(evento.data).getDate()}
                  </span>
                  <span className="text-xs uppercase opacity-90">
                    {new Date(evento.data).toLocaleDateString("pt-BR", { month: "short" })}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground dark:text-white">
                      {evento.titulo}
                    </h4>
                    <Badge variant={evento.ativo ? "success" : "warning"}>
                      {evento.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-madeira/60 dark:text-areia/70">
                    <span>{formatarData(evento.data)}</span>
                    <span>{evento.hora}</span>
                    <span>{evento.local}</span>
                    <span>{evento.tipo}</span>
                  </div>
                  {evento.artista && (
                    <p className="text-xs text-terracota mt-1">
                      Artista: {evento.artista.nome}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAtivo(evento.id, evento.ativo)}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-areia dark:hover:bg-areia/20 hover:text-madeira dark:hover:text-white transition-colors"
                    title={evento.ativo ? "Desativar" : "Ativar"}
                  >
                    {evento.ativo ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/dashboard/eventos/${evento.id}/editar`}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-areia dark:hover:bg-areia/20 hover:text-madeira dark:hover:text-white transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este evento?")) {
                        handleDelete(evento.id);
                      }
                    }}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-red-50 hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
