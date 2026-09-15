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
    color: "from-blue-600 to-blue-800",
    bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
  },
  {
    name: "Dança",
    icon: Footprints,
    color: "from-purple-600 to-purple-800",
    bgImage: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=80",
  },
  {
    name: "Teatro",
    icon: Drama,
    color: "from-red-600 to-red-800",
    bgImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80",
  },
  {
    name: "Artes Visuais",
    icon: Paintbrush,
    color: "from-amber-500 to-amber-700",
    bgImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
  },
  {
    name: "Literatura",
    icon: BookOpen,
    color: "from-emerald-600 to-emerald-800",
    bgImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  },
  {
    name: "Artesanato",
    icon: Scissors,
    color: "from-rose-500 to-rose-700",
    bgImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80",
  },
];

interface GenreCardsProps {
  counts: Record<string, number>;
}

export default function GenreCards({ counts }: GenreCardsProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
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
              className="group relative overflow-hidden rounded-xl h-32 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${genero.bgImage})` }}
              />
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${genero.color} opacity-75 group-hover:opacity-90 transition-opacity`}
              />
              {/* Content */}
              <div className="relative flex h-full flex-col items-center justify-center text-white z-10">
                <Icon className="mb-2 h-8 w-8" />
                <span className="text-sm font-semibold">{genero.name}</span>
                <span className="text-xs opacity-80">
                  {count} artista{count !== 1 && "s"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
