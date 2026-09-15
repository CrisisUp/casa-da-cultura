"use client";

import Link from "next/link";
import {
  Music,
  Drama,
  Paintbrush,
  BookOpen,
  Scissors,
  Footprints,
} from "lucide-react";

const generos = [
  {
    name: "Música",
    icon: Music,
    color: "from-terracota to-terracota-dark",
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
  },
  {
    name: "Dança",
    icon: Footprints,
    color: "from-oliva to-oliva-dark",
    bgImage: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=80",
  },
  {
    name: "Teatro",
    icon: Drama,
    color: "from-barro to-madeira",
    bgImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80",
  },
  {
    name: "Artes Visuais",
    icon: Paintbrush,
    color: "from-ambar to-ambar-dark",
    bgImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
  },
  {
    name: "Literatura",
    icon: BookOpen,
    color: "from-oliva-light to-oliva",
    bgImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  },
  {
    name: "Artesanato",
    icon: Scissors,
    color: "from-terracota-light to-terracota",
    bgImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80",
  },
];

interface GenreCardsProps {
  counts: Record<string, number>;
}

export default function GenreCards({ counts }: GenreCardsProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
        Gêneros Artísticos
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {generos.map((genero) => {
          const count = counts[genero.name] || 0;
          const Icon = genero.icon;

          return (
            <Link
              key={genero.name}
              href={`/dashboard/artistas?genero=${encodeURIComponent(genero.name)}`}
              className="group relative overflow-hidden rounded-2xl h-36 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-terracota/20 hover:-translate-y-1"
              aria-label={`Ver artistas de ${genero.name}`}
            >
              {/* Background image with zoom effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${genero.bgImage})` }}
              />
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${genero.color} opacity-80 group-hover:opacity-90 transition-all duration-500`}
              />
              {/* Blur overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 backdrop-blur-0 group-hover:backdrop-blur-[2px]" />
              {/* Content */}
              <div className="relative flex h-full flex-col items-center justify-center text-white z-10 transition-transform duration-500 group-hover:scale-110">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/30 group-hover:rotate-6">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold font-[family-name:var(--font-playfair)]">
                  {genero.name}
                </span>
                <span className="text-xs text-white/80 mt-0.5">
                  {count} artista{count !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
