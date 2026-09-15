import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DepoimentoForm from "@/components/depoimentos/DepoimentoForm";

export const dynamic = "force-dynamic";

export default async function EditarDepoimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const depoimento = await prisma.depoimento.findUnique({
    where: { id },
  });

  if (!depoimento) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
          Editar Depoimento
        </h2>
        <p className="text-madeira/70">
          Atualize o depoimento de {depoimento.nome}
        </p>
      </div>
      <DepoimentoForm depoimento={depoimento} isEdit />
    </div>
  );
}
