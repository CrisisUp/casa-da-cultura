"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface Artista {
  id: string;
  nome: string;
  generoArtistico: string;
  foto: string | null;
  experienciaArtistica: string | null;
}

interface HeroFeaturedProps {
  artista: Artista | null;
}

export default function HeroFeatured({ artista }: HeroFeaturedProps) {
  if (!artista) return null;

  return (
    <Link
      href={`/dashboard/artistas/${artista.id}`}
      className="group relative block h-72 overflow-hidden rounded-3xl md:h-80"
    >
      {/* Imagem de fundo */}
      <img
        src={artista.foto || "/artista.png"}
        alt={artista.nome}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay escuro gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white">
          <Sparkles className="h-3 w-3" />
          Artista em Destaque
        </span>
      </div>

      {/* Conteúdo */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        <p className="text-sm font-medium text-white/70 mb-1">
          {artista.generoArtistico}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">
          {artista.nome}
        </h2>
        {artista.experienciaArtistica && (
          <p className="text-sm text-white/70 max-w-lg line-clamp-2 mb-4">
            {artista.experienciaArtistica}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all">
          Ver perfil
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
