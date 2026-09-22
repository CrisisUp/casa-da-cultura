"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { eventoSchema } from "@/lib/validations";
import { Artista } from "@/types/models";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TIPOS = [
  { value: "", label: "Selecione..." },
  { value: "Música", label: "Música" },
  { value: "Dança", label: "Dança" },
  { value: "Teatro", label: "Teatro" },
  { value: "Artes Visuais", label: "Artes Visuais" },
  { value: "Literatura", label: "Literatura" },
  { value: "Artesanato", label: "Artesanato" },
  { value: "Outro", label: "Outro" },
];

const CORES = [
  { value: "bg-terracota", label: "Terracota" },
  { value: "bg-oliva", label: "Oliva" },
  { value: "bg-barro", label: "Barro" },
  { value: "bg-ambar", label: "Âmbar" },
  { value: "bg-madeira", label: "Madeira" },
];

interface EventoData {
  id?: string;
  titulo?: string | null;
  descricao?: string | null;
  data?: string | null;
  hora?: string | null;
  local?: string | null;
  tipo?: string | null;
  cor?: string | null;
  artistaId?: string | null;
  ativo?: boolean;
}

interface EventoFormProps {
  evento?: EventoData;
  isEdit?: boolean;
}

export default function EventoForm({ evento, isEdit }: EventoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/artistas?limit=1000")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar artistas");
        return res.json();
      })
      .then((data) => setArtistas(data.artistas || []))
      .catch((err) => {
        console.error("Erro ao carregar artistas:", err);
        toast.error("Erro ao carregar artistas");
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);

    const data = {
      titulo: form.get("titulo") as string,
      descricao: form.get("descricao") as string,
      data: form.get("data") as string,
      hora: form.get("hora") as string,
      local: form.get("local") as string,
      tipo: form.get("tipo") as string,
      cor: form.get("cor") as string,
      artistaId: (form.get("artistaId") as string) || null,
      ativo: form.get("ativo") === "on",
    };

    // Validar com Zod
    const result = eventoSchema.safeParse(data);

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

    const url = isEdit ? `/api/eventos/${evento?.id}` : "/api/eventos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    setLoading(false);

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(
        errorData.details?.join(", ") ||
          errorData.error ||
          "Erro ao salvar evento"
      );
      return;
    }

    toast.success(isEdit ? "Evento atualizado!" : "Evento criado!");
    router.push("/dashboard/eventos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card principal — usando .cultural-card para adaptação automática ao tema */}
      <div className="cultural-card space-y-4">
        <h3 className="font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          Dados do Evento
        </h3>

        <Input
          name="titulo"
          label="Título do Evento *"
          defaultValue={evento?.titulo ?? ""}
          placeholder="Ex: Festival de Música"
          required
          error={errors.titulo}
        />

        {/* Textarea — substituindo bg-white e cores fixas por tokens semânticos */}
        <div className="space-y-1.5">
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-secondary"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            defaultValue={evento?.descricao ?? ""}
            placeholder="Descreva o evento..."
            rows={3}
            className="block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            name="data"
            label="Data *"
            type="date"
            defaultValue={evento?.data?.split("T")[0] ?? ""}
            required
            error={errors.data}
          />
          <Input
            name="hora"
            label="Horário *"
            type="time"
            defaultValue={evento?.hora ?? ""}
            required
            error={errors.hora}
          />
          <Input
            name="local"
            label="Local *"
            defaultValue={evento?.local ?? ""}
            placeholder="Ex: Auditório Principal"
            required
            error={errors.local}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            name="tipo"
            label="Tipo *"
            options={TIPOS}
            defaultValue={evento?.tipo ?? ""}
            required
            error={errors.tipo}
          />
          <Select
            name="cor"
            label="Cor"
            options={CORES}
            defaultValue={evento?.cor ?? "bg-terracota"}
          />
          <Select
            name="artistaId"
            label="Artista (opcional)"
            options={[
              { value: "", label: "Nenhum" },
              ...artistas.map((a) => ({ value: a.id, label: a.nome })),
            ]}
            defaultValue={evento?.artistaId ?? ""}
          />
        </div>

        {/* Checkbox com cores semânticas */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="ativo"
            name="ativo"
            defaultChecked={evento?.ativo ?? true}
            className="h-4 w-4 rounded border-border text-primary bg-card focus:ring-primary/40 focus:ring-offset-0 cursor-pointer accent-[var(--color-terracota)]"
          />
          <label
            htmlFor="ativo"
            className="text-sm text-secondary cursor-pointer select-none"
          >
            Evento ativo (aparece no dashboard)
          </label>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEdit ? (
            "Salvar Alterações"
          ) : (
            "Criar Evento"
          )}
        </Button>
      </div>
    </form>
  );
}