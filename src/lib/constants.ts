const GENERO_VALUES = [
  "Música",
  "Dança",
  "Teatro",
  "Artes Visuais",
  "Literatura",
  "Artesanato",
] as const;

export function generos(emptyLabel: string) {
  return [
    { value: "", label: emptyLabel },
    ...GENERO_VALUES.map((g) => ({ value: g, label: g })),
  ];
}
