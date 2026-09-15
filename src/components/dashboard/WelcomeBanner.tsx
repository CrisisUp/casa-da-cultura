"use client";

import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "Usuário";

  const hour = new Date().getHours();
  let greeting = "Bom dia";
  if (hour >= 12 && hour < 18) greeting = "Boa tarde";
  if (hour >= 18) greeting = "Boa noite";

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-cultural p-8 text-white shadow-lg">
      {/* Padrão decorativo */}
      <div className="absolute inset-0 cultural-pattern opacity-20" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-white/5" />
      <div className="absolute right-1/4 bottom-2 h-16 w-16 rounded-full bg-ambar/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-ambar-light" />
          <span className="text-sm font-medium text-areia/90">
            Casa da Cultura
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1 font-[family-name:var(--font-display)]">
          {greeting}, {name}!
        </h2>
        <p className="text-areia/80">
          Gerencie o cadastro de artistas da Casa da Cultura
        </p>
      </div>
    </div>
  );
}
