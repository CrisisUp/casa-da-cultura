import { z } from "zod";

export const artistaSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(200, "Nome muito longo"),
  cpf: z
    .string()
    .min(14, "CPF inválido")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido (000.000.000-00)"),
  rg: z.string().optional().or(z.literal("")),
  telefone: z
    .string()
    .min(15, "Telefone inválido")
    .max(15, "Telefone inválido")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido ((00) 00000-0000)"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  escolaridade: z.string().optional().or(z.literal("")),
  experienciaArtistica: z.string().optional().or(z.literal("")),
  redesSociais: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
  generoArtistico: z
    .string()
    .min(1, "Selecione um gênero artístico"),
  foto: z.string().optional().or(z.literal("")),
});

export const depoimentoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  genero: z.string().min(1, "Selecione um gênero"),
  texto: z.string().min(10, "Texto deve ter pelo menos 10 caracteres"),
  avatar: z.string().optional().or(z.literal("")),
  ativo: z.boolean().default(true),
  ordem: z.number().int().nonnegative().default(0),
});

export const depoimentoUpdateSchema = depoimentoSchema.partial();

export const eventoSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().optional().or(z.literal("")),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Data inválida"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:mm)"),
  local: z.string().min(3, "Local deve ter pelo menos 3 caracteres"),
  tipo: z.string().min(1, "Selecione um tipo"),
  cor: z.string().optional().or(z.literal("")),
  artistaId: z.string().uuid().optional().or(z.literal("")).nullable(),
  ativo: z.boolean().default(true),
});

export const eventoUpdateSchema = eventoSchema.partial();

export type ArtistaFormData = z.infer<typeof artistaSchema>;
export type DepoimentoFormData = z.infer<typeof depoimentoSchema>;
export type EventoFormData = z.infer<typeof eventoSchema>;
