"use client";

import { useState, useEffect } from "react";
import { Star, Quote, AlertCircle, RefreshCw } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/depoimentos")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar depoimentos");
        return res.json();
      })
      .then((data) => {
        setDepoimentos(data.depoimentos || data || []);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao carregar depoimentos:", err);
        setError("Erro ao carregar depoimentos");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme dark:from-[#22150e] dark:to-[#150e09] p-6 border border-areia dark:border-areia/20 transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
            O que dizem nossos artistas
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white dark:bg-[#1a120b] p-4 border border-areia/50 dark:border-areia/20">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-4 rounded bg-areia dark:bg-areia/30" />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-areia dark:bg-areia/30 rounded w-full" />
                <div className="h-3 bg-areia dark:bg-areia/30 rounded w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-areia dark:bg-areia/30" />
                <div className="space-y-1">
                  <div className="h-3 bg-areia dark:bg-areia/30 rounded w-20" />
                  <div className="h-2 bg-areia dark:bg-areia/30 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-danger/10 p-6 border border-danger/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-danger" />
          <h3 className="text-lg font-semibold text-danger">Erro ao carregar depoimentos</h3>
        </div>
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (depoimentos.length === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme dark:from-[#22150e] dark:to-[#150e09] p-6 border border-areia dark:border-areia/20 transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
            O que dizem nossos artistas
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-madeira/60 dark:text-areia/70">
            Nenhum depoimento cadastrado ainda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-areia/50 to-creme dark:from-[#22150e] dark:to-[#150e09] p-6 border border-areia dark:border-areia/20 transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <Quote className="h-5 w-5 text-terracota" />
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
          O que dizem nossos artistas
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {depoimentos.map((depoimento) => (
          <div
            key={depoimento.id}
            className="rounded-xl bg-white dark:bg-[#1a120b] p-4 shadow-sm border border-areia/50 dark:border-areia/20 hover:shadow-md transition-shadow"
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
            <p className="text-sm text-madeira/80 dark:text-areia/80 mb-4 italic">
              &ldquo;{depoimento.texto}&rdquo;
            </p>

            {/* Autor */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracota/10 dark:bg-terracota/20 text-terracota font-semibold text-sm">
                {depoimento.avatar || depoimento.nome.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground dark:text-foreground">
                  {depoimento.nome}
                </p>
                <p className="text-xs text-madeira/60 dark:text-areia/60">
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
