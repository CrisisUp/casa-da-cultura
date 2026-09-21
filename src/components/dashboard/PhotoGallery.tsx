"use client";

import Link from "next/link";
import { Camera, Plus } from "lucide-react";
import { Artista } from "@/types/models";

interface PhotoGalleryProps {
  artistas: Pick<Artista, "id" | "nome" | "generoArtistico" | "foto">[];
}

export default function PhotoGallery({ artistas }: PhotoGalleryProps) {
  const artistasComFoto = artistas.filter((a) => a.foto);

  if (artistasComFoto.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-sm border border-areia dark:border-areia/20 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
            Galeria de Artistas
          </h3>
          <Link
            href="/dashboard/artistas/novo"
            className="inline-flex items-center gap-2 text-sm text-terracota hover:text-terracota-dark font-medium"
          >
            <Plus className="h-4 w-4" />
            Cadastrar
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-areia dark:bg-areia/20 mb-4">
            <Camera className="h-8 w-8 text-madeira/40 dark:text-areia/60" />
          </div>
          <p className="text-madeira/60 dark:text-areia/70 mb-2">Nenhuma foto cadastrada ainda</p>
          <p className="text-sm text-madeira/40 dark:text-areia/50">
            Cadastre artistas com fotos para ver a galeria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-sm border border-areia dark:border-areia/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
          Galeria de Artistas
        </h3>
        <Link
          href="/dashboard/artistas"
          className="text-sm text-terracota hover:text-terracota-dark font-medium"
        >
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {artistasComFoto.slice(0, 8).map((artista) => (
          <Link
            key={artista.id}
            href={`/dashboard/artistas/${artista.id}`}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={artista.foto!}
              alt={artista.nome}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm font-semibold truncate">
                {artista.nome}
              </p>
              <p className="text-white/70 text-xs">
                {artista.generoArtistico}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {artistasComFoto.length > 8 && (
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/artistas"
            className="inline-flex items-center gap-2 rounded-xl bg-areia/50 dark:bg-areia/20 px-4 py-2 text-sm font-medium text-madeira dark:text-areia hover:bg-areia transition-colors"
          >
            Ver mais {artistasComFoto.length - 8} fotos
          </Link>
        </div>
      )}
    </div>
  );
}
