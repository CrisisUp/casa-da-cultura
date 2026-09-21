"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
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
