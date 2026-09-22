"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { generos, statusBadgeVariant, statusOptions } from "@/lib/constants";
import { gerarPDF } from "@/lib/pdf";
import { formatCPF, formatDate } from "@/lib/utils";
import { Artista } from "@/types/models";
import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RelatoriosPage() {
  const [genero, setGenero] = useState("");
  const [status, setStatus] = useState("");
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true); // ← começa como true
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarArtistas() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "1000", genero, status });
        const res = await fetch(`/api/artistas?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!controller.signal.aborted) {
          setArtistas(
            data.artistas.map((a: Record<string, unknown>) => ({
              ...a,
              createdAt: new Date(a.createdAt as string),
            }))
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error("Erro ao carregar artistas");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    carregarArtistas();

    // Cleanup: cancela o fetch se o componente desmontar ou o filtro mudar
    return () => {
      controller.abort();
    };
  }, [genero, status]);

  function handleExportPDF() {
    setExporting(true);
    try {
      const titulo = genero
        ? `Relatório de Artistas - ${genero}`
        : "Relatório Geral de Artistas";

      const dados = artistas.map((a) => ({
        ...a,
      }));

      gerarPDF(dados, titulo);
      toast.success("PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Relatórios
          </h2>
          <p className="text-muted">
            Gere relatórios dos artistas cadastrados
          </p>
        </div>
        <Button
          onClick={handleExportPDF}
          variant="secondary"
          disabled={exporting || loading}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select
          options={generos("Todos os gêneros")}
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />
        <Select
          options={statusOptions()}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      {/* Card do relatório */}
      <div className="cultural-card overflow-hidden p-0">
        <div className="border-b border-border-subtle bg-subtle px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="cultural-section-title text-base">
                Relatório de Artistas
              </h3>
              <p className="text-sm text-muted">
                {artistas.length} registro{artistas.length !== 1 ? "s" : ""}
                {genero && ` • Gênero: ${genero}`}
                {status && ` • Status: ${status}`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-subtle">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Gênero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Cadastro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {artistas.map((artista, index) => (
                  <tr
                    key={artista.id}
                    className="hover:bg-subtle transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-muted">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-foreground">
                      {artista.nome}
                    </td>
                    <td className="px-6 py-3 text-sm text-muted">
                      {formatCPF(artista.cpf)}
                    </td>
                    <td className="px-6 py-3 text-sm text-muted">
                      {artista.generoArtistico}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusBadgeVariant(artista.status)}>
                        {artista.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-muted">
                      {formatDate(artista.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}