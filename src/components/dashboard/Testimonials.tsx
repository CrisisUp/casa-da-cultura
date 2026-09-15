"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

interface Depoimento {
  id: string;
  nome: string;
  genero: string;
  texto: string;
  avatar: string | null;
}

export default function Testimonials() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/depoimentos")
      .then((res) => res.json())
      .then((data) => {
        setDepoimentos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme p-6 border border-areia">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            O que dizem nossos artistas
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-4 border border-areia/50">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-4 rounded bg-areia" />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-areia rounded w-full" />
                <div className="h-3 bg-areia rounded w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-areia" />
                <div className="space-y-1">
                  <div className="h-3 bg-areia rounded w-20" />
                  <div className="h-2 bg-areia rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (depoimentos.length === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme p-6 border border-areia">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            O que dizem nossos artistas
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-madeira/60">
            Nenhum depoimento cadastrado ainda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme p-6 border border-areia">
      <div className="flex items-center gap-2 mb-6">
        <Quote className="h-5 w-5 text-terracota" />
        <h3 className="text-lg font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          O que dizem nossos artistas
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {depoimentos.map((depoimento) => (
          <div
            key={depoimento.id}
            className="rounded-xl bg-white p-4 shadow-sm border border-areia/50 hover:shadow-md transition-shadow"
          >
            {/* Estrelas */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-ambar fill-ambar"
                />
              ))}
            </div>

            {/* Texto */}
            <p className="text-sm text-madeira/80 mb-4 italic">
              &ldquo;{depoimento.texto}&rdquo;
            </p>

            {/* Autor */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracota/10 text-terracota font-semibold text-sm">
                {depoimento.avatar || depoimento.nome.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {depoimento.nome}
                </p>
                <p className="text-xs text-madeira/60">
                  {depoimento.genero}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
