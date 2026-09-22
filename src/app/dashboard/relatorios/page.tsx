"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { formatCPF, formatDate } from "@/lib/utils";
import { gerarPDF } from "@/lib/pdf";
import { generos, statusOptions, statusBadgeVariant } from "@/lib/constants";
import { Artista } from "@/types/models";

export default function RelatoriosPage() {
  const [genero, setGenero] = useState("");
  const [status, setStatus] = useState("");
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchArtistas();
  }, [genero, status]);

  async function fetchArtistas() {
    setLoading(true);
    const params = new URLSearchParams({ limit: "1000", genero, status });
    const res = await fetch(`/api/artistas?${params}`);
    const data = await res.json();
    setArtistas(
      data.artistas.map((a: Record<string, unknown>) => ({
        ...a,
        createdAt: new Date(a.createdAt as string),
      }))
    );
    setLoading(false);
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">Relatórios</h2>
          <p className="text-madeira/70 dark:text-areia/70">Gere relatórios dos artistas cadastrados</p>
        </div>
        <Button onClick={handleExportPDF} variant="secondary" disabled={exporting || loading}>
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar PDF
        </Button>
      </div>

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

      <div className="cultural-card overflow-hidden p-0">
        <div className="border-b border-areia dark:border-areia/20 bg-areia/20 dark:bg-[#1a120b] px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-terracota" />
            <div>
              <h3 className="cultural-section-title text-base">
                Relatório de Artistas
              </h3>
              <p className="text-sm text-madeira/60 dark:text-areia/70">
                {artistas.length} registro{artistas.length !== 1 ? "s" : ""}
                {genero && ` • Gênero: ${genero}`}
                {status && ` • Status: ${status}`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-madeira/60 dark:text-areia/70">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-areia dark:border-areia/20 bg-areia/10 dark:bg-[#1f140e]">
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    Gênero
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">
                    Cadastro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-areia/50 dark:divide-areia/20">
                {artistas.map((artista, index) => (
                  <tr key={artista.id} className="hover:bg-areia/10 dark:hover:bg-areia/10 transition-colors">
                    <td className="px-6 py-3 text-sm text-madeira/60 dark:text-areia/70">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-foreground dark:text-white">
                      {artista.nome}
                    </td>
                    <td className="px-6 py-3 text-sm text-madeira/80 dark:text-areia/80">
                      {formatCPF(artista.cpf)}
                    </td>
                    <td className="px-6 py-3 text-sm text-madeira/80 dark:text-areia/80">
                      {artista.generoArtistico}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={statusBadgeVariant(artista.status)}
                      >
                        {artista.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-madeira/60 dark:text-areia/70">
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
