"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Calendar, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  /**
   * Formata a data de forma resiliente.
   * Aceita string ISO, string YYYY-MM-DD ou Date.
   * Retorna "Data não informada" se for inválida.
   */
  function formatarData(data: string | null | undefined): string {
    if (!data) return "Data não informada";

    // Se vier no formato "YYYY-MM-DD", adiciona T00:00:00 no fuso local
    // Se vier em ISO completo, usa direto
    const dateStr = data.includes("T") ? data : `${data}T00:00:00`;
    const parsed = new Date(dateStr);

    if (isNaN(parsed.getTime())) return "Data inválida";

    return parsed.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /**
   * Extrai o dia e o mês (abreviado) para o card visual de data.
   */
  function extrairDiaMes(data: string | null | undefined): {
    dia: string;
    mes: string;
  } {
    if (!data) return { dia: "--", mes: "---" };

    const dateStr = data.includes("T") ? data : `${data}T00:00:00`;
    const parsed = new Date(dateStr);

    if (isNaN(parsed.getTime())) return { dia: "--", mes: "---" };

    return {
      dia: String(parsed.getDate()).padStart(2, "0"),
      mes: parsed
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "")
        .toUpperCase(),
    };
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho — usando tokens semânticos */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Eventos
          </h2>
          <p className="text-muted">
            {eventos.length} evento{eventos.length !== 1 ? "s" : ""} cadastrado
            {eventos.length !== 1 ? "s" : ""}
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
          <p className="text-muted">Carregando...</p>
        </div>
      ) : eventos.length === 0 ? (
        <div className="cultural-card p-12 text-center">
          <Calendar className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-muted mb-4">Nenhum evento cadastrado</p>
          <Link href="/dashboard/eventos/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro evento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => {
            const { dia, mes } = extrairDiaMes(evento.data);

            return (
              <article
                key={evento.id}
                className={`cultural-card group ${
                  !evento.ativo ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Card de Data */}
                  <div
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
                      evento.cor || "bg-terracota"
                    } text-white font-bold leading-none`}
                  >
                    <span className="text-xl font-[family-name:var(--font-playfair)]">
                      {dia}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider mt-0.5 opacity-90">
                      {mes}
                    </span>
                  </div>

                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    {/* Linha 1: Título + Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-base font-semibold text-foreground truncate">
                        {evento.titulo}
                      </h4>
                      <Badge variant={evento.ativo ? "success" : "warning"}>
                        {evento.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    {/* Linha 2: Detalhes secundários — usando text-muted */}
                    <div className="flex items-center gap-3 text-sm text-muted mt-1 flex-wrap">
                      <span>{formatarData(evento.data)}</span>
                      <span>•</span>
                      <span>{evento.hora}</span>
                      <span>•</span>
                      <span className="truncate">{evento.local}</span>
                      <span>•</span>
                      <span>{evento.tipo}</span>
                    </div>

                    {/* Linha 3: Artista (opcional) */}
                    {evento.artista && (
                      <p className="text-xs text-terracota mt-1">
                        Artista: {evento.artista.nome}
                      </p>
                    )}
                  </div>

                  {/* Ações — usando .action-icon padronizado */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleAtivo(evento.id, evento.ativo)}
                      className="action-icon"
                      title={evento.ativo ? "Desativar" : "Ativar"}
                      aria-label={evento.ativo ? "Desativar evento" : "Ativar evento"}
                    >
                      {evento.ativo ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/dashboard/eventos/${evento.id}/editar`}
                      className="action-icon"
                      title="Editar"
                      aria-label={`Editar ${evento.titulo}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm("Tem certeza que deseja excluir este evento?")
                        ) {
                          handleDelete(evento.id);
                        }
                      }}
                      className="action-icon action-icon-danger"
                      title="Excluir"
                      aria-label={`Excluir ${evento.titulo}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}