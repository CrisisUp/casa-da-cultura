"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SetFeaturedButtonProps {
  artistaId: string;
  isDestaque: boolean;
}

export default function SetFeaturedButton({ artistaId, isDestaque }: SetFeaturedButtonProps) {
  const router = useRouter();

  async function handleSetFeatured() {
    const res = await fetch(`/api/artistas/${artistaId}/destaque`, {
      method: "PATCH",
    });

    if (!res.ok) {
      toast.error("Erro ao definir destaque");
      return;
    }

    toast.success("Artista definido como Destaque!");
    router.refresh();
  }

  return (
    <button
      onClick={handleSetFeatured}
      title={isDestaque ? "Artista em Destaque" : "Definir como Destaque"}
      className={`rounded-lg p-2 transition-colors ${
        isDestaque
          ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
          : "text-madeira/40 hover:bg-areia hover:text-amber-500"
      }`}
    >
      <Star className={`h-4 w-4 ${isDestaque ? "fill-amber-500" : ""}`} />
    </button>
  );
}
