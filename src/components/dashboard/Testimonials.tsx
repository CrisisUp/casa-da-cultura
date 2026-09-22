"use client";

import { AlertCircle, Quote, RefreshCw, Star } from "lucide-react";
import { useEffect, useState } from "react";

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
    const controller = new AbortController();

    fetch("/api/depoimentos", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar depoimentos");
        return res.json();
      })
      .then((data) => {
        setDepoimentos(Array.isArray(data) ? data : data.depoimentos ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Erro ao carregar depoimentos:", err);
        setError("Erro ao carregar depoimentos");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="cultural-card" aria-label="Depoimentos - Carregando">
        <header className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="cultural-section-title">
            O que dizem nossos artistas
          </h3>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <article
              key={i}
              className="animate-pulse rounded-xl bg-surface p-4 border border-border"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-4 rounded bg-areia/50 dark:bg-areia/20"
                  />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-areia/50 dark:bg-areia/20 rounded w-full" />
                <div className="h-3 bg-areia/50 dark:bg-areia/20 rounded w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-areia/50 dark:bg-areia/20" />
                <div className="space-y-1">
                  <div className="h-3 bg-areia/50 dark:bg-areia/20 rounded w-20" />
                  <div className="h-2 bg-areia/50 dark:bg-areia/20 rounded w-12" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="cultural-card bg-danger/10 border-danger/20"
        aria-label="Erro ao carregar depoimentos"
      >
        <header className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-danger" />
          <h3 className="cultural-section-title text-danger">
            Erro ao carregar depoimentos
          </h3>
        </header>
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </button>
      </section>
    );
  }

  if (depoimentos.length === 0) {
    return (
      <section
        className="cultural-card"
        aria-label="Nenhum depoimento cadastrado"
      >
        <header className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-terracota" />
          <h3 className="cultural-section-title">
            O que dizem nossos artistas
          </h3>
        </header>
        <div className="text-center py-8">
          <p className="text-muted">Nenhum depoimento cadastrado ainda</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cultural-card" aria-label="O que dizem nossos artistas">
      <header className="flex items-center gap-2 mb-6">
        <Quote className="h-5 w-5 text-terracota" />
        <h3 className="cultural-section-title">
          O que dizem nossos artistas
        </h3>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {depoimentos.map((depoimento) => (
          <article
            key={depoimento.id}
            className="rounded-xl bg-surface p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
          >
            {/* Estrelas */}
            <div className="flex gap-1 mb-3" aria-label="5 de 5 estrelas">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-ambar fill-ambar" />
              ))}
            </div>

            {/* Texto */}
            <blockquote className="text-sm text-muted-strong mb-4 italic">
              &ldquo;{depoimento.texto}&rdquo;
            </blockquote>

            {/* Autor */}
            <footer className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracota/10 dark:bg-terracota/20 text-terracota font-semibold text-sm">
                {depoimento.avatar || depoimento.nome.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {depoimento.nome}
                </p>
                <p className="text-xs text-muted">{depoimento.genero}</p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}