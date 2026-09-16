"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatCPF, formatDate } from "@/lib/utils";
import { Artista } from "@/types/models";

interface ArtistaTableProps {
  artistas: Pick<Artista, "id" | "nome" | "cpf" | "telefone" | "email" | "generoArtistico" | "status" | "createdAt">[];
  onDelete: (id: string) => void;
}

export default function ArtistaTable({ artistas, onDelete }: ArtistaTableProps) {
  if (artistas.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <p className="text-gray-500">Nenhum artista encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                CPF
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Gênero
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Telefone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Cadastro
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artistas.map((artista) => (
              <tr key={artista.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {artista.nome.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {artista.nome}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatCPF(artista.cpf)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {artista.generoArtistico}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {artista.telefone}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={artista.status === "ATIVO" ? "success" : "danger"}>
                    {artista.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(new Date(artista.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/artistas/${artista.id}`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/dashboard/artistas/${artista.id}/editar`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este artista?")) {
                          onDelete(artista.id);
                        }
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
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
