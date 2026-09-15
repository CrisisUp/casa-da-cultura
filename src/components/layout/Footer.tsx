"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-areia gradient-cultural">
      <div className="flex items-center justify-between px-6 py-3">
        <p className="text-xs text-areia/80">
          © {new Date().getFullYear()} Casa da Cultura
        </p>
        <p className="flex items-center gap-1 text-xs text-areia/80">
          Feito com <Heart className="h-3 w-3 text-ambar-light fill-ambar-light" /> para a comunidade
        </p>
      </div>
    </footer>
  );
}
