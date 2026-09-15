import EventoForm from "@/components/eventos/EventoForm";

export default function NovoEventoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
          Novo Evento
        </h2>
        <p className="text-madeira/70">
          Registre um evento para aparecer no calendário do dashboard
        </p>
      </div>
      <EventoForm />
    </div>
  );
}
