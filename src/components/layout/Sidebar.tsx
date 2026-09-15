"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Palette,
  LogOut,
} from "lucide-react";
import { classNames } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Artistas", href: "/dashboard/artistas", icon: Users },
  { name: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      className="flex h-full w-64 flex-col"
      role="navigation"
      aria-label="Menu principal"
    >
      {/* Header com gradiente cultural */}
      <div className="relative overflow-hidden gradient-cultural px-6 py-6">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 cultural-pattern opacity-30" />
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white block font-[family-name:var(--font-display)]">
              Casa da Cultura
            </span>
            <span className="text-xs text-areia/80">
              Cadastro de Artistas
            </span>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 py-4 bg-creme">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-terracota text-white shadow-md shadow-terracota/30"
                  : "text-madeira hover:bg-areia hover:text-terracota-dark"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-areia bg-creme p-4">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-madeira hover:bg-red-50 hover:text-danger transition-colors"
          aria-label="Sair do sistema"
        >
          <LogOut className="h-5 w-5" />
          Sair do sistema
        </button>
      </div>
    </div>
  );
}
