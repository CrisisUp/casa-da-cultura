import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCPF, formatDate } from "./utils";

interface ArtistaPDF {
  nome: string;
  cpf: string;
  generoArtistico: string;
  telefone: string;
  email?: string | null;
  status: string;
  createdAt: Date;
}

export function gerarPDF(artistas: ArtistaPDF[], titulo: string) {
  const doc = new jsPDF("landscape", "mm", "a4");

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Casa da Cultura", 14, 15);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(titulo, 14, 23);

  doc.setFontSize(10);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} | Total: ${artistas.length} registro(s)`,
    14,
    29
  );

  // Tabela
  const data = artistas.map((a, i) => [
    (i + 1).toString(),
    a.nome,
    formatCPF(a.cpf),
    a.generoArtistico,
    a.telefone,
    a.email || "-",
    a.status,
    formatDate(a.createdAt),
  ]);

  autoTable(doc, {
    startY: 35,
    head: [["#", "Nome", "CPF", "Gênero", "Telefone", "Email", "Status", "Cadastro"]],
    body: data,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 40 },
      6: { cellWidth: 20 },
      7: { cellWidth: 25 },
    },
    margin: { left: 14, right: 14 },
  });

  // Rodapé — ponytail: use jsPDF public API, upgrade to use doc.getNumberOfPages() if available
  const pageCount = (doc.internal?.pages?.length ?? 1) - 1 || 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Download
  const filename = `${titulo.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
