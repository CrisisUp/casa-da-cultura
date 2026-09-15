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
    <div className="flex h-full w-64 flex-col">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary-dark to-primary px-6 py-6">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white block">
              Casa da Cultura
            </span>
            <span className="text-xs text-blue-200">Sistema de Cadastro</span>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 py-4 bg-gray-50">
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
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair do sistema
        </button>
      </div>
    </div>
  );
}
