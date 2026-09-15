"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-primary-dark">
      <div className="flex items-center justify-between px-6 py-3">
        <p className="text-xs text-blue-200">
          © {new Date().getFullYear()} Casa da Cultura
        </p>
        <p className="flex items-center gap-1 text-xs text-blue-200">
          Feito com <Heart className="h-3 w-3 text-red-400 fill-red-400" /> para a comunidade
        </p>
      </div>
    </footer>
  );
}
