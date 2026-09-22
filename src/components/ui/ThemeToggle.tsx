"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Lê o estado real DEPOIS de montar (evita mismatch de hidratação)
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    // Placeholder neutro para evitar mismatch
    return (
      <button
        className="flex items-center gap-2 rounded-xl p-2.5 text-madeira hover:bg-areia dark:hover:bg-areia/10 dark:text-areia transition-colors border border-areia/50"
        aria-label="Alternar modo Dia/Noite"
        disabled
      >
        <div className="h-5 w-5" />
        <span className="text-xs font-medium hidden sm:inline">—</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-xl p-2.5 text-madeira hover:bg-areia dark:hover:bg-areia/10 dark:text-areia transition-colors border border-areia/50"
      aria-label="Alternar modo Dia/Noite"
      title={isDark ? "Mudar para Modo Dia" : "Mudar para Modo Noite"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-ambar" />
      ) : (
        <Moon className="h-5 w-5 text-madeira" />
      )}
      <span className="text-xs font-medium hidden sm:inline">
        {isDark ? "Noite" : "Dia"}
      </span>
    </button>
  );
}