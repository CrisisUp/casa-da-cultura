"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { formatCPF, formatDate } from "@/lib/utils";
import { gerarPDF } from "@/lib/pdf";

const GENEROS = [
  { value: "", label: "Todos os gêneros" },
  { value: "Música", label: "Música" },
  { value: "Dança", label: "Dança" },
  { value: "Teatro", label: "Teatro" },
  { value: "Artes Visuais", label: "Artes Visuais" },
  { value: "Literatura", label: "Literatura" },
  { value: "Artesanato", label: "Artesanato" },
];

interface Artista {
  id: string;
  nome: string;
  cpf: string;
  generoArtistico: string;
  telefone: string;
  email: string | null;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
}

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
    setArtistas(data.artistas);
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
        createdAt: new Date(a.createdAt),
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
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-500">Gere relatórios dos artistas cadastrados</p>
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
          options={GENEROS}
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />
        <Select
          options={[
            { value: "", label: "Todos os status" },
            { value: "ATIVO", label: "Ativo" },
            { value: "INATIVO", label: "Inativo" },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">
                Relatório de Artistas
              </h3>
              <p className="text-sm text-gray-500">
                {artistas.length} registro{artistas.length !== 1 && "s"}
                {genero && ` • Gênero: ${genero}`}
                {status && ` • Status: ${status}`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Gênero
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Cadastro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artistas.map((artista, index) => (
                  <tr key={artista.id}>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {artista.nome}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {formatCPF(artista.cpf)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {artista.generoArtistico}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={artista.status === "ATIVO" ? "success" : "danger"}
                      >
                        {artista.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {formatDate(new Date(artista.createdAt))}
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
