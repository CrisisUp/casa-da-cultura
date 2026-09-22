"use client";

import ArtistaFilters from "@/components/artistas/ArtistaFilters";
import ArtistaTable from "@/components/artistas/ArtistaTable";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { Artista } from "@/types/models";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ArtistasPage() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
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
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        genero,
        status,
      });

      const res = await fetch(`/api/artistas?${params}`);
      if (!res.ok) throw new Error("Falha ao carregar artistas");

      const data = await res.json();
      setArtistas(data.artistas);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, genero, status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArtistas();
  }, [fetchArtistas]);

  // ✅ Reset de página direto no handler, sem useEffect
  function handleSearchChange(value: string) {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  function handleGeneroChange(value: string) {
    setGenero(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/artistas/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.error || "Erro ao deletar artista");
      return;
    }

    toast.success("Artista deletado com sucesso!");
    fetchArtistas();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">
            Artistas
          </h2>
          <p className="text-foreground/80 dark:text-gray-300 font-medium">
            {pagination.total} artista{pagination.total !== 1 ? "s" : ""} cadastrado
            {pagination.total !== 1 ? "s" : ""}
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
        onSearchChange={handleSearchChange}
        onGeneroChange={handleGeneroChange}
        onStatusChange={handleStatusChange}
      />

      {loading ? (
        <div className="cultural-card p-12 text-center">
          <p className="text-foreground dark:text-white font-medium">Carregando...</p>
        </div>
      ) : (
        <>
          <ArtistaTable
            artistas={artistas}
            onDelete={handleDelete}
            onUpdate={fetchArtistas}
          />
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