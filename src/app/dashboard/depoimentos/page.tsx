"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Depoimento {
  id: string;
  nome: string;
  genero: string;
  texto: string;
  avatar: string | null;
  ativo: boolean;
  ordem: number;
}

export default function DepoimentosPage() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  async function fetchDepoimentos() {
    const res = await fetch("/api/depoimentos?all=true");
    const data = await res.json();
    setDepoimentos(data.depoimentos || data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/depoimentos/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Depoimento removido!");
      fetchDepoimentos();
    } else {
      toast.error("Erro ao remover depoimento");
    }
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    const res = await fetch(`/api/depoimentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !ativo }),
    });
    if (res.ok) {
      toast.success(ativo ? "Depoimento desativado" : "Depoimento ativado");
      fetchDepoimentos();
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho — usando tokens semânticos */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Depoimentos
          </h2>
          <p className="text-muted">
            {depoimentos.length} depoimento
            {depoimentos.length !== 1 ? "s" : ""} cadastrado
            {depoimentos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/depoimentos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Depoimento
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="cultural-card p-12 text-center">
          <p className="text-muted">Carregando...</p>
        </div>
      ) : depoimentos.length === 0 ? (
        <div className="cultural-card p-12 text-center">
          <MessageSquareQuote className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-muted mb-4">Nenhum depoimento cadastrado</p>
          <Link href="/dashboard/depoimentos/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro depoimento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {depoimentos.map((depoimento) => (
            <article
              key={depoimento.id}
              className={`cultural-card group ${
                !depoimento.ativo ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar — com adaptação para dark mode */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracota/10 dark:bg-terracota/20 text-terracota font-semibold text-sm shrink-0">
                  {depoimento.avatar || depoimento.nome.charAt(0)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  {/* Linha 1: Nome + Badge + Gênero */}
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h4 className="text-base font-semibold text-foreground truncate">
                      {depoimento.nome}
                    </h4>
                    <Badge variant={depoimento.ativo ? "success" : "warning"}>
                      {depoimento.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                    <span className="text-xs text-muted">
                      {depoimento.genero}
                    </span>
                  </div>

                  {/* Linha 2: Texto do depoimento */}
                  <p className="text-sm text-muted line-clamp-2">
                    {depoimento.texto}
                  </p>
                </div>

                {/* Ações — usando .action-icon padronizado */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAtivo(depoimento.id, depoimento.ativo)}
                    className="action-icon"
                    title={depoimento.ativo ? "Desativar" : "Ativar"}
                    aria-label={
                      depoimento.ativo
                        ? "Desativar depoimento"
                        : "Ativar depoimento"
                    }
                  >
                    {depoimento.ativo ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/dashboard/depoimentos/${depoimento.id}/editar`}
                    className="action-icon"
                    title="Editar"
                    aria-label={`Editar depoimento de ${depoimento.nome}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Tem certeza que deseja excluir este depoimento?"
                        )
                      ) {
                        handleDelete(depoimento.id);
                      }
                    }}
                    className="action-icon action-icon-danger"
                    title="Excluir"
                    aria-label={`Excluir depoimento de ${depoimento.nome}`}
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