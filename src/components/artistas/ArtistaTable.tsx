"use client";

import SetFeaturedButton from "@/components/artistas/SetFeaturedButton";
import ToggleStatusButton from "@/components/artistas/ToggleStatusButton";
import Badge from "@/components/ui/Badge";
import { statusBadgeVariant } from "@/lib/constants";
import { formatCPF, formatDate } from "@/lib/utils";
import { Artista } from "@/types/models";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ArtistaTableProps {
  artistas: Pick<
    Artista,
    | "id"
    | "nome"
    | "cpf"
    | "telefone"
    | "email"
    | "generoArtistico"
    | "status"
    | "destaque"
    | "createdAt"
  >[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function ArtistaTable({
  artistas,
  onDelete,
  onUpdate,
}: ArtistaTableProps) {
  if (artistas.length === 0) {
    return (
      <div className="cultural-card p-12 text-center">
        <p className="text-foreground font-medium">Nenhum artista encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {artistas.map((artista) => (
        <article
          key={artista.id}
          className="rounded-2xl bg-surface border border-border p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracota/10 dark:bg-terracota/20 text-terracota font-semibold text-base overflow-hidden">
              {artista.nome.charAt(0)}
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0">
              {/* Linha 1: Nome + Badge + Gênero */}
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {artista.nome}
                </h3>
                <Badge variant={statusBadgeVariant(artista.status)}>
                  {artista.status}
                </Badge>
                <span className="text-xs text-muted">
                  {artista.generoArtistico}
                </span>
              </div>

              {/* Linha 2: Detalhes secundários */}
              <p className="text-sm text-muted mt-1 truncate">
                CPF {formatCPF(artista.cpf)}
                {artista.telefone && ` • ${artista.telefone}`}
                {artista.createdAt &&
                  ` • Cadastrado em ${formatDate(new Date(artista.createdAt))}`}
              </p>
            </div>

            {/* Ações à direita */}
            <div className="flex items-center gap-1 shrink-0">
              <ToggleStatusButton
                artistaId={artista.id}
                statusAtual={artista.status}
                isAdmin={true}
                onUpdate={onUpdate}
              />
              <SetFeaturedButton
                artistaId={artista.id}
                isDestaque={!!artista.destaque}
                onUpdate={onUpdate}
              />
              <Link
                href={`/dashboard/artistas/${artista.id}`}
                title="Ver perfil"
                className="rounded-lg p-2 text-muted hover:bg-areia dark:hover:bg-areia/20 hover:text-foreground transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/dashboard/artistas/${artista.id}/editar`}
                title="Editar"
                className="rounded-lg p-2 text-muted hover:bg-areia dark:hover:bg-areia/20 hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  if (confirm("Tem certeza que deseja excluir este artista?")) {
                    onDelete(artista.id);
                  }
                }}
                title="Excluir"
                className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}