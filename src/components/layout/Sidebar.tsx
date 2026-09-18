"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquareQuote,
  Palette,
  LogOut,
  X,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { classNames } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Artistas", href: "/dashboard/artistas", icon: Users },
  { name: "Eventos", href: "/dashboard/eventos", icon: Calendar },
  { name: "Depoimentos", href: "/dashboard/depoimentos", icon: MessageSquareQuote },
  { name: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
  { name: "Usuários", href: "/dashboard/usuarios", icon: ShieldCheck },
];

const secondaryNav = [
  { name: "Ajuda", href: "#", icon: HelpCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay - sempre aparece quando aberto */}
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - sempre como drawer, em qualquer tela */}
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Header com gradiente cultural */}
        <div className="relative overflow-hidden gradient-cultural px-6 py-6">
          <div className="absolute inset-0 cultural-pattern opacity-20" />
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block font-[family-name:var(--font-playfair)]">
                  Casa da Cultura
                </span>
                <span className="text-xs text-areia/80">
                  Cadastro de Artistas
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navegação principal */}
        <nav className="flex-1 space-y-1 px-3 py-4 bg-creme">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
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

        {/* Separador */}
        <div className="mx-4 border-t border-areia" />

        {/* Navegação secundária */}
        <nav className="space-y-1 px-3 py-3 bg-creme">
          {secondaryNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-madeira/70 hover:bg-areia hover:text-madeira transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-areia bg-creme p-4">
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-madeira hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label="Sair do sistema"
          >
            <LogOut className="h-5 w-5" />
            Sair do sistema
          </button>
        </div>
      </aside>
    </>
  );
}
