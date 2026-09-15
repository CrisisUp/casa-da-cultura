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
    <div className="relative overflow-hidden rounded-3xl text-white shadow-xl h-48">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/criancas.png)" }}
      />
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/70 to-transparent" />

      <div className="relative z-10 flex h-full items-center p-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-ambar-light" />
            <span className="text-sm font-medium text-areia/90">
              Casa da Cultura
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2 font-[family-name:var(--font-display)]">
            {greeting}, {name}!
          </h2>
          <p className="text-areia/80 max-w-md">
            Gerencie o cadastro de artistas da Casa da Cultura
          </p>
        </div>
      </div>
    </div>
  );
}
