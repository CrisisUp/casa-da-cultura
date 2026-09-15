"use client";

import { Star, Quote } from "lucide-react";

const depoimentos = [
  {
    nome: "Maria Silva",
    genero: "Música",
    texto: "A Casa da Cultura transformou minha carreira. Hoje sou cantora profissional graças às oportunidades que recebi aqui.",
    avatar: "MS",
  },
  {
    nome: "João Santos",
    genero: "Dança",
    texto: "O cadastro no sistema me conectou com outros artistas e abriu portas para participar de eventos culturais.",
    avatar: "JS",
  },
  {
    nome: "Ana Oliveira",
    genero: "Artes Visuais",
    texto: "Ter minha arte reconhecida e poder compartilhar com a comunidade é uma experiência incrível.",
    avatar: "AO",
  },
];

export default function Testimonials() {
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
            key={depoimento.nome}
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
                {depoimento.avatar}
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
