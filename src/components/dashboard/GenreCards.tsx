"use client";

import ArtisticDivider from "@/components/ui/ArtisticDivider";
import {
  BookOpen,
  Drama,
  Footprints,
  Music,
  Paintbrush,
  Scissors,
} from "lucide-react";
import Link from "next/link";

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
    <section aria-labelledby="genres-heading">
      <header className="mb-2">
        <h3 id="genres-heading" className="cultural-section-title tracking-wide text-xl">
          Gêneros Artísticos
        </h3>
        <ArtisticDivider />
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {generos.map((genero) => {
          const count = counts[genero.name] || 0;
          const Icon = genero.icon;

          return (
            <article key={genero.name}>
              <Link
                href={`/dashboard/artistas?genero=${encodeURIComponent(genero.name)}`}
                className="group relative overflow-hidden organic-card h-44 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-terracota/20 hover:-translate-y-1 p-3 text-center flex flex-col items-center justify-center border border-white/20 block"
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 backdrop-blur-0 group-hover:backdrop-blur-[2px]" />
                {/* Content */}
                <div className="relative flex h-full flex-col items-center justify-center text-white z-10 transition-transform duration-500 group-hover:scale-105">
                  <div className="mb-2.5 flex h-14 w-14 items-center justify-center organic-badge bg-white/25 backdrop-blur-sm transition-all duration-500 group-hover:bg-white/40 group-hover:rotate-6 shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-lg font-extrabold font-[family-name:var(--font-playfair)] tracking-wide drop-shadow-md">
                    {genero.name}
                  </span>
                  <span className="text-xs font-bold text-white mt-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs shadow-sm">
                    {count} artista{count !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
