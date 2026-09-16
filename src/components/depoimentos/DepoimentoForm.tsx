"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { depoimentoSchema } from "@/lib/validations";

const GENEROS = [
  { value: "", label: "Selecione..." },
  { value: "Música", label: "Música" },
  { value: "Dança", label: "Dança" },
  { value: "Teatro", label: "Teatro" },
  { value: "Artes Visuais", label: "Artes Visuais" },
  { value: "Literatura", label: "Literatura" },
  { value: "Artesanato", label: "Artesanato" },
];

interface DepoimentoData {
  id?: string;
  nome?: string | null;
  genero?: string | null;
  texto?: string | null;
  avatar?: string | null;
  ativo?: boolean;
  ordem?: number;
}

interface DepoimentoFormProps {
  depoimento?: DepoimentoData;
  isEdit?: boolean;
}

export default function DepoimentoForm({ depoimento, isEdit }: DepoimentoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);

    const data = {
      nome: form.get("nome") as string,
      genero: form.get("genero") as string,
      texto: form.get("texto") as string,
      avatar: form.get("avatar") as string,
      ativo: form.get("ativo") === "on",
      ordem: parseInt(form.get("ordem") as string) || 0,
    };

    // Validar com Zod
    const result = depoimentoSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Corrija os erros no formulário");
      setLoading(false);
      return;
    }

    const url = isEdit ? `/api/depoimentos/${depoimento?.id}` : "/api/depoimentos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    setLoading(false);

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(errorData.details?.join(", ") || errorData.error || "Erro ao salvar depoimento");
      return;
    }

    toast.success(isEdit ? "Depoimento atualizado!" : "Depoimento criado!");
    router.push("/dashboard/depoimentos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-areia space-y-4">
        <h3 className="font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          Dados do Depoimento
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="nome"
            label="Nome do Artista *"
            defaultValue={depoimento?.nome ?? ""}
            required
          />
          <Select
            name="genero"
            label="Gênero Artístico *"
            options={GENEROS}
            defaultValue={depoimento?.genero ?? ""}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-madeira">
            Depoimento *
          </label>
          <textarea
            name="texto"
            defaultValue={depoimento?.texto ?? ""}
            placeholder="Escreva o depoimento do artista..."
            className="block w-full rounded-xl border border-areia bg-white px-4 py-2.5 text-foreground placeholder-madeira/40 shadow-sm transition-all duration-200 focus:border-terracota focus:outline-none focus:ring-2 focus:ring-terracota/20"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="avatar"
            label="Iniciais (avatar)"
            defaultValue={depoimento?.avatar ?? ""}
            placeholder="MS"
            maxLength={2}
          />
          <Input
            name="ordem"
            label="Ordem de exibição"
            type="number"
            defaultValue={depoimento?.ordem?.toString() || "0"}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ativo"
            defaultChecked={depoimento?.ativo ?? true}
            className="h-4 w-4 rounded border-areia text-terracota focus:ring-terracota"
          />
          <label className="text-sm text-madeira">
            Depoimento ativo (aparece no dashboard)
          </label>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEdit ? (
            "Salvar Alterações"
          ) : (
            "Criar Depoimento"
          )}
        </Button>
      </div>
    </form>
  );
}
