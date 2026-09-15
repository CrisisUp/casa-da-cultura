"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Sistema de Cadastro</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-gray-500 capitalize">
              {(session?.user as any)?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
