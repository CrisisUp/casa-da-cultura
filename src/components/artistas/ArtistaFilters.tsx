"use client";

import { Search } from "lucide-react";
import Select from "@/components/ui/Select";

const GENEROS = [
  { value: "", label: "Todos os gêneros" },
  { value: "Música", label: "Música" },
  { value: "Dança", label: "Dança" },
  { value: "Teatro", label: "Teatro" },
  { value: "Artes Visuais", label: "Artes Visuais" },
  { value: "Literatura", label: "Literatura" },
  { value: "Artesanato", label: "Artesanato" },
];

const STATUS = [
  { value: "", label: "Todos os status" },
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
];

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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <Select
        options={GENEROS}
        value={genero}
        onChange={(e) => onGeneroChange(e.target.value)}
      />
      <Select
        options={STATUS}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      />
    </div>
  );
}
