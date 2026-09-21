"use client";

import { useSession } from "next-auth/react";
import { User, Menu } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-areia bg-white dark:bg-[#1a120b] dark:border-areia/20 px-6 transition-colors">
      <div className="flex items-center gap-3">
        {/* Hamburger - sempre visível */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-madeira hover:bg-areia dark:hover:bg-areia/10 dark:text-areia transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-foreground dark:text-foreground font-[family-name:var(--font-playfair)]">
          Sistema de Cadastro
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracota/10">
            <User className="h-4 w-4 text-terracota" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground dark:text-areia">{session?.user?.name}</p>
            <p className="text-madeira/60 dark:text-areia/60 capitalize">
              {session?.user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
