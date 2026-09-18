"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SetFeaturedButton from "@/components/artistas/SetFeaturedButton";
import ToggleStatusButton from "@/components/artistas/ToggleStatusButton";
import { formatCPF, formatDate } from "@/lib/utils";
import { Artista } from "@/types/models";
import { statusBadgeVariant } from "@/lib/constants";

interface ArtistaTableProps {
  artistas: Pick<Artista, "id" | "nome" | "cpf" | "telefone" | "email" | "generoArtistico" | "status" | "destaque" | "createdAt">[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function ArtistaTable({ artistas, onDelete, onUpdate }: ArtistaTableProps) {
  if (artistas.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-areia">
        <p className="text-madeira/60">Nenhum artista encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm border border-areia overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-areia bg-areia/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">CPF</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">Gênero</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">Telefone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-madeira/60">Cadastro</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-madeira/60">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-areia">
            {artistas.map((artista) => (
              <tr key={artista.id} className="hover:bg-areia/55 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-terracota/10 flex items-center justify-center text-sm font-medium text-terracota">
                      {artista.nome.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{artista.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-madeira/60">{formatCPF(artista.cpf)}</td>
                <td className="px-4 py-3 text-sm text-madeira/60">{artista.generoArtistico}</td>
                <td className="px-4 py-3 text-sm text-madeira/60">{artista.telefone}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadgeVariant(artista.status)}>{artista.status}</Badge>
                    <ToggleStatusButton
                      artistaId={artista.id}
                      statusAtual={artista.status as any}
                      isAdmin={true}
                      onUpdate={onUpdate}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-madeira/60">{formatDate(new Date(artista.createdAt))}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 items-center">
                    <SetFeaturedButton artistaId={artista.id} isDestaque={!!artista.destaque} onUpdate={onUpdate} />
                    <Link
                      href={`/dashboard/artistas/${artista.id}`}
                      className="rounded-lg p-2 text-madeira/40 hover:bg-areia hover:text-madeira"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/artistas/${artista.id}/editar`}
                      className="rounded-lg p-2 text-madeira/40 hover:bg-areia hover:text-madeira"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este artista?")) {
                          onDelete(artista.id);
                        }
                      }}
                      className="rounded-lg p-2 text-madeira/40 hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}