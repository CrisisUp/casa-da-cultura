"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import ArtistaTable from "@/components/artistas/ArtistaTable";
import ArtistaFilters from "@/components/artistas/ArtistaFilters";

interface Artista {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string | null;
  generoArtistico: string;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ArtistasPage() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [genero, setGenero] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchArtistas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: "10",
      search,
      genero,
      status,
    });

    const res = await fetch(`/api/artistas?${params}`);
    const data = await res.json();

    setArtistas(data.artistas);
    setPagination(data.pagination);
    setLoading(false);
  }, [pagination.page, search, genero, status]);

  useEffect(() => {
    fetchArtistas();
  }, [fetchArtistas]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, genero, status]);

  async function handleDelete(id: string) {
    await fetch(`/api/artistas/${id}`, { method: "DELETE" });
    fetchArtistas();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Artistas</h2>
          <p className="text-gray-500">
            {pagination.total} artista{pagination.total !== 1 ? "s" : ""} cadastrado{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/artistas/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Artista
          </Button>
        </Link>
      </div>

      <ArtistaFilters
        search={search}
        genero={genero}
        status={status}
        onSearchChange={setSearch}
        onGeneroChange={setGenero}
        onStatusChange={setStatus}
      />

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : (
        <>
          <ArtistaTable artistas={artistas} onDelete={handleDelete} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </>
      )}
    </div>
  );
}
