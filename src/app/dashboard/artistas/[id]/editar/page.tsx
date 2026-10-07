import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidUUID } from "@/lib/utils";
import ArtistaForm from "@/components/artistas/ArtistaForm";

export const dynamic = "force-dynamic";

export default async function EditarArtistaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Verificar autenticação
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  // Validar formato do ID
  if (!isValidUUID(id)) {
    notFound();
  }

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
        <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">Editar Artista</h2>
        <p className="text-foreground/70 dark:text-gray-300 font-medium">Atualize os dados de {artista.nome}</p>
      </div>
      <ArtistaForm artista={artistaData} isEdit />
    </div>
  );
}
