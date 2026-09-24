"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { generos } from "@/lib/constants";
import { depoimentoSchema } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

interface ApiErrorResponse {
  error?: string;
  details?: string[] | string;
  success?: boolean;
}

export default function DepoimentoForm({
  depoimento,
  isEdit,
}: DepoimentoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const form = new FormData(e.currentTarget);

      const data = {
        nome: (form.get("nome") as string)?.trim() || "",
        genero: (form.get("genero") as string) || "",
        texto: (form.get("texto") as string)?.trim() || "",
        avatar: (form.get("avatar") as string)?.trim() || null,
        ativo: form.get("ativo") === "on",
        ordem: parseInt(form.get("ordem") as string) || 0,
      };

      const result = depoimentoSchema.safeParse(data);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast.error("Corrija os erros no formulário");
        return;
      }

      const url = isEdit
        ? `/api/depoimentos/${depoimento?.id}`
        : "/api/depoimentos";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const texto = await res.text();
        let errorData: ApiErrorResponse = {};

        try {
          errorData = texto ? JSON.parse(texto) : {};
        } catch {
          errorData = {};
        }

        const msg =
          (Array.isArray(errorData.details)
            ? errorData.details.join(", ")
            : errorData.details) ||
          errorData.error ||
          `Erro ${res.status}: ${res.statusText || "falha na requisição"}`;

        toast.error(msg);
        return;
      }

      toast.success(isEdit ? "Depoimento atualizado!" : "Depoimento criado!");
      router.push("/dashboard/depoimentos");
      router.refresh();
    } catch (err) {
      console.error("Erro no submit:", err);
      toast.error("Erro inesperado ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="cultural-card space-y-4">
        <h3 className="font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          Dados do Depoimento
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="nome"
            label="Nome do Artista *"
            defaultValue={depoimento?.nome ?? ""}
            required
            error={errors.nome}
          />
          <Select
            name="genero"
            label="Gênero Artístico *"
            options={generos("Selecione...")}
            defaultValue={depoimento?.genero ?? ""}
            required
            error={errors.genero}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="texto"
            className="block text-sm font-medium text-secondary"
          >
            Depoimento *
          </label>
          <textarea
            id="texto"
            name="texto"
            defaultValue={depoimento?.texto ?? ""}
            placeholder="Escreva o depoimento do artista..."
            rows={4}
            required
            className="block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.texto && (
            <p className="text-xs text-danger">{errors.texto}</p>
          )}
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

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="ativo"
            name="ativo"
            defaultChecked={depoimento?.ativo ?? true}
            className="h-4 w-4 rounded border-border bg-card focus:ring-primary/40 focus:ring-offset-0 cursor-pointer accent-[var(--color-terracota)]"
          />
          <label
            htmlFor="ativo"
            className="text-sm text-secondary cursor-pointer select-none"
          >
            Depoimento ativo (aparece no dashboard)
          </label>
        </div>
      </div>

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