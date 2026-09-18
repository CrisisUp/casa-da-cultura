"use client";

import toast from "react-hot-toast";

interface ToggleStatusButtonProps {
  artistaId: string;
  statusAtual: "ATIVO" | "INATIVO";
  isAdmin: boolean;
  onUpdate: () => void;
}

export default function ToggleStatusButton({ artistaId, statusAtual, isAdmin, onUpdate }: ToggleStatusButtonProps) {
  if (!isAdmin) return null;

  const novoStatus = statusAtual === "ATIVO" ? "INATIVO" : "ATIVO";

  async function handleToggle() {
    const res = await fetch(`/api/artistas/${artistaId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (!res.ok) {
      toast.error("Erro ao alterar status");
      return;
    }

    toast.success(`Artista alterado para ${novoStatus}!`);
    onUpdate();
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
        statusAtual === "ATIVO"
          ? "bg-oliva/10 text-oliva hover:bg-oliva/20"
          : "bg-danger/10 text-danger hover:bg-danger/20"
      }`}
      title="Clique para alternar o status"
    >
      {statusAtual === "ATIVO" ? "Desativar" : "Ativar"}
    </button>
  );
}
