"use client";

import Select from "@/components/ui/Select";
import { generos, statusOptions } from "@/lib/constants";
import { Search } from "lucide-react";

interface ArtistaFiltersProps {
  search: string;
  genero: string;
  status: string;
  onSearchChange: (value: string) => void;
  onGeneroChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ArtistaFilters({
  search,
  genero,
  status,
  onSearchChange,
  onGeneroChange,
  onStatusChange,
}: ArtistaFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-terracota focus:outline-none focus:ring-1 focus:ring-terracota"
        />
      </div>
      <Select
        options={generos("Todos os gêneros")}
        value={genero}
        onChange={(e) => onGeneroChange(e.target.value)}
      />
      <Select
        options={statusOptions()}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      />
    </div>
  );
}