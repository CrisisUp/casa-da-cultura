import ArtistaForm from "@/components/artistas/ArtistaForm";

export default function NovoArtistaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">Novo Artista</h2>
        <p className="text-foreground/70 dark:text-gray-300 font-medium">Preencha os dados para cadastrar um novo artista</p>
      </div>
      <ArtistaForm />
    </div>
  );
}
