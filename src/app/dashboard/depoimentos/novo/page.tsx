import DepoimentoForm from "@/components/depoimentos/DepoimentoForm";

export default function NovoDepoimentoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
          Novo Depoimento
        </h2>
        <p className="text-madeira/70">
          Adicione um depoimento de artista para aparecer no dashboard
        </p>
      </div>
      <DepoimentoForm />
    </div>
  );
}
