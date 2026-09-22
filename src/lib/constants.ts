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

export const EVENTO_TIPOS = [
  { value: "", label: "Selecione..." },
  { value: "Música", label: "Música" },
  { value: "Dança", label: "Dança" },
  { value: "Teatro", label: "Teatro" },
  { value: "Artes Visuais", label: "Artes Visuais" },
  { value: "Literatura", label: "Literatura" },
  { value: "Artesanato", label: "Artesanato" },
  { value: "Outro", label: "Outro" },
];

export const EVENTO_CORES = [
  { value: "bg-terracota", label: "Terracota" },
  { value: "bg-oliva", label: "Oliva" },
  { value: "bg-barro", label: "Barro" },
  { value: "bg-ambar", label: "Âmbar" },
  { value: "bg-madeira", label: "Madeira" },
];

export const ESCOLARIDADES = [
  { value: "", label: "Selecione..." },
  { value: "Fundamental Incompleto", label: "Fundamental Incompleto" },
  { value: "Fundamental Completo", label: "Fundamental Completo" },
  { value: "Médio Incompleto", label: "Médio Incompleto" },
  { value: "Médio Completo", label: "Médio Completo" },
  { value: "Superior Incompleto", label: "Superior Incompleto" },
  { value: "Superior Completo", label: "Superior Completo" },
  { value: "Pós-graduação", label: "Pós-graduação" },
];
