import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArtistaForm from "@/components/artistas/ArtistaForm";

export const dynamic = "force-dynamic";

export default async function EditarArtistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const artista = await prisma.artista.findUnique({
    where: { id },
  });

  if (!artista) {
    notFound();
  }

  const artistaData = {
    ...artista,
    dataNascimento: artista.dataNascimento?.toISOString(),
    createdAt: artista.createdAt.toISOString(),
    updatedAt: artista.updatedAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Editar Artista</h2>
        <p className="text-gray-500">Atualize os dados de {artista.nome}</p>
      </div>
      <ArtistaForm artista={artistaData} isEdit />
    </div>
  );
}
