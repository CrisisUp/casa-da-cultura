"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatCPF, formatPhone } from "@/lib/utils";
import { artistaSchema } from "@/lib/validations";
import { generos } from "@/lib/constants";

const ESCOLARIDADES = [
  { value: "", label: "Selecione..." },
  { value: "Fundamental Incompleto", label: "Fundamental Incompleto" },
  { value: "Fundamental Completo", label: "Fundamental Completo" },
  { value: "Médio Incompleto", label: "Médio Incompleto" },
  { value: "Médio Completo", label: "Médio Completo" },
  { value: "Superior Incompleto", label: "Superior Incompleto" },
  { value: "Superior Completo", label: "Superior Completo" },
  { value: "Pós-graduação", label: "Pós-graduação" },
];

interface ArtistaData {
  id?: string;
  nome?: string | null;
  cpf?: string | null;
  rg?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  dataNascimento?: string | null;
  escolaridade?: string | null;
  experienciaArtistica?: string | null;
  redesSociais?: string | null;
  observacoes?: string | null;
  generoArtistico?: string | null;
  foto?: string | null;
}

interface ArtistaFormProps {
  artista?: ArtistaData;
  isEdit?: boolean;
}

function toStr(val: string | null | undefined): string {
  return val ?? "";
}

export default function ArtistaForm({ artista, isEdit }: ArtistaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [foto, setFoto] = useState(artista?.foto || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);

    const data = {
      nome: form.get("nome") as string,
      cpf: form.get("cpf") as string,
      rg: form.get("rg") as string,
      telefone: form.get("telefone") as string,
      email: form.get("email") as string,
      endereco: form.get("endereco") as string,
      dataNascimento: form.get("dataNascimento") as string,
      escolaridade: form.get("escolaridade") as string,
      experienciaArtistica: form.get("experienciaArtistica") as string,
      redesSociais: form.get("redesSociais") as string,
      observacoes: form.get("observacoes") as string,
      generoArtistico: form.get("generoArtistico") as string,
      foto,
    };

    // Validar com Zod
    const result = artistaSchema.safeParse(data);

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

    setLoading(true);

    const url = isEdit ? `/api/artistas/${artista?.id}` : "/api/artistas";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Erro ao salvar artista");
      return;
    }

    toast.success(isEdit ? "Artista atualizado!" : "Artista cadastrado!");
    router.push("/dashboard/artistas");
    router.refresh();
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      setFoto(url);
      toast.success("Foto enviada!");
    } else {
      toast.error("Erro ao enviar foto");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Foto */}
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-areia overflow-hidden flex items-center justify-center">
          {foto ? (
            <img src={foto} alt="Foto" className="h-full w-full object-cover" />
          ) : (
            <span className="text-madeira/40 text-sm">Sem foto</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-madeira mb-1">
            Foto do Artista
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="text-sm text-madeira/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-terracota/10 file:text-terracota hover:file:bg-terracota/20"
          />
        </div>
      </div>

      {/* Dados Pessoais */}
      <div className="rounded-xl bg-areia/50 p-4 space-y-4">
        <h3 className="font-medium text-foreground">Dados Pessoais</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="nome"
            label="Nome Completo *"
            defaultValue={toStr(artista?.nome)}
            error={errors.nome}
            required
          />
          <Input
            name="cpf"
            label="CPF *"
            defaultValue={artista?.cpf ? formatCPF(artista.cpf) : ""}
            onChange={(e) => {
              e.target.value = formatCPF(e.target.value);
            }}
            error={errors.cpf}
            placeholder="000.000.000-00"
            required
          />
          <Input
            name="rg"
            label="RG"
            defaultValue={toStr(artista?.rg)}
          />
          <Input
            name="dataNascimento"
            label="Data de Nascimento"
            type="date"
            defaultValue={toStr(artista?.dataNascimento?.split("T")[0])}
          />
        </div>
      </div>

      {/* Contato */}
      <div className="rounded-xl bg-areia/50 p-4 space-y-4">
        <h3 className="font-medium text-foreground">Contato</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            name="telefone"
            label="Telefone *"
            defaultValue={artista?.telefone ? formatPhone(artista.telefone) : ""}
            onChange={(e) => {
              e.target.value = formatPhone(e.target.value);
            }}
            error={errors.telefone}
            placeholder="(00) 00000-0000"
            required
          />
          <Input
            name="email"
            label="Email"
            type="email"
            defaultValue={toStr(artista?.email)}
            error={errors.email}
          />
          <Input
            name="endereco"
            label="Endereço"
            defaultValue={toStr(artista?.endereco)}
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Dados Artísticos */}
      <div className="rounded-xl bg-areia/50 p-4 space-y-4">
        <h3 className="font-medium text-foreground">Dados Artísticos</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Select
              name="generoArtistico"
              label="Gênero Artístico *"
              options={generos("Selecione...")}
              defaultValue={artista?.generoArtistico || ""}
              error={errors.generoArtistico}
              required
            />
            {errors.generoArtistico && (
              <p className="text-sm text-danger">{errors.generoArtistico}</p>
            )}
          </div>
          <Select
            name="escolaridade"
            label="Escolaridade"
            options={ESCOLARIDADES}
            defaultValue={artista?.escolaridade || ""}
          />
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-madeira">
              Experiência Artística
            </label>
            <textarea
              name="experienciaArtistica"
              defaultValue={toStr(artista?.experienciaArtistica)}
              placeholder="Descreva a experiência artística..."
              className="block w-full rounded-lg border border-areia px-3 py-2 text-foreground placeholder-madeira/40 shadow-sm focus:border-terracota focus:outline-none focus:ring-1 focus:ring-terracota"
              rows={3}
            />
          </div>
          <Input
            name="redesSociais"
            label="Redes Sociais"
            defaultValue={toStr(artista?.redesSociais)}
            placeholder="@instagram, link do facebook..."
            className="md:col-span-2"
          />
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-madeira">
              Observações
            </label>
            <textarea
              name="observacoes"
              defaultValue={toStr(artista?.observacoes)}
              placeholder="Observações adicionais..."
              className="block w-full rounded-lg border border-areia px-3 py-2 text-foreground placeholder-madeira/40 shadow-sm focus:border-terracota focus:outline-none focus:ring-1 focus:ring-terracota"
              rows={2}
            />
          </div>
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
            "Cadastrar Artista"
          )}
        </Button>
      </div>
    </form>
  );
}
