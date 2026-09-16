const GENERO_VALUES = [
  "Música",
  "Dança",
  "Teatro",
  "Artes Visuais",
  "Literatura",
  "Artesanato",
] as const;

export type GeneroArtistico = (typeof GENERO_VALUES)[number];

export function generos(emptyLabel: string) {
  return [
    { value: "", label: emptyLabel },
    ...GENERO_VALUES.map((g) => ({ value: g, label: g })),
  ];
}

export const STATUS_VALUES = ["ATIVO", "INATIVO"] as const;
export type StatusArtista = (typeof STATUS_VALUES)[number];

export function statusOptions() {
  return STATUS_VALUES.map((s) => ({ value: s, label: s.charAt(0) + s.slice(1).toLowerCase() }));
}

export function statusBadgeVariant(status: StatusArtista) {
  return status === "ATIVO" ? "success" : "danger";
}