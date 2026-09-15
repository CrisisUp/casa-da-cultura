"use client";

import { Palette, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-r from-primary-dark to-primary">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo e info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Casa da Cultura</h4>
              <p className="text-sm text-blue-200">
                Promovendo Arte, Educação e Tradições Locais
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-blue-200">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Sobre
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Contato
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacidade
            </a>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="mt-6 border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} Casa da Cultura. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1 text-sm text-blue-200">
              Feito com <Heart className="h-4 w-4 text-red-400 fill-red-400" /> para a comunidade
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
