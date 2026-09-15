"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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
    setDepoimentos(data);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Depoimentos
          </h2>
          <p className="text-madeira/70">
            {depoimentos.length} depoimento{depoimentos.length !== 1 && "s"} cadastrado{depoimentos.length !== 1 && "s"}
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
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-areia">
          <p className="text-madeira/60">Carregando...</p>
        </div>
      ) : depoimentos.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-areia">
          <p className="text-madeira/60 mb-4">Nenhum depoimento cadastrado</p>
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
            <div
              key={depoimento.id}
              className={`rounded-2xl bg-white p-4 shadow-sm border border-areia transition-all ${
                !depoimento.ativo ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracota/10 text-terracota font-semibold text-sm shrink-0">
                  {depoimento.avatar || depoimento.nome.charAt(0)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {depoimento.nome}
                    </h4>
                    <Badge variant={depoimento.ativo ? "success" : "warning"}>
                      {depoimento.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                    <span className="text-xs text-madeira/50">
                      {depoimento.genero}
                    </span>
                  </div>
                  <p className="text-sm text-madeira/70 line-clamp-2">
                    {depoimento.texto}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleAtivo(depoimento.id, depoimento.ativo)}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-areia hover:text-madeira transition-colors"
                    title={depoimento.ativo ? "Desativar" : "Ativar"}
                  >
                    {depoimento.ativo ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <Link
                    href={`/dashboard/depoimentos/${depoimento.id}/editar`}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-areia hover:text-madeira transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este depoimento?")) {
                        handleDelete(depoimento.id);
                      }
                    }}
                    className="rounded-lg p-2 text-madeira/50 hover:bg-red-50 hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
