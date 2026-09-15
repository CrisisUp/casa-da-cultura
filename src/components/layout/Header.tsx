"use client";

import { useSession } from "next-auth/react";
import { User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-areia bg-white px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger - mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-madeira hover:bg-areia transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-foreground font-[family-name:var(--font-display)]">
          Sistema de Cadastro
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracota/10">
            <User className="h-4 w-4 text-terracota" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{session?.user?.name}</p>
            <p className="text-madeira/60 capitalize">
              {(session?.user as any)?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
