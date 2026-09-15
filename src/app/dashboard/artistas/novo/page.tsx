import ArtistaForm from "@/components/artistas/ArtistaForm";

export default function NovoArtistaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Novo Artista</h2>
        <p className="text-gray-500">Preencha os dados para cadastrar um novo artista</p>
      </div>
      <ArtistaForm />
    </div>
  );
}
