import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventoForm from "@/components/eventos/EventoForm";

export const dynamic = "force-dynamic";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const evento = await prisma.evento.findUnique({
    where: { id },
  });

  if (!evento) {
    notFound();
  }

  const eventoData = {
    ...evento,
    data: evento.data.toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
          Editar Evento
        </h2>
        <p className="text-madeira/70">
          Atualize os dados do evento {evento.titulo}
        </p>
      </div>
      <EventoForm evento={eventoData} isEdit />
    </div>
  );
}
