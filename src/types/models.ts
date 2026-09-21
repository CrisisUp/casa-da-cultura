export interface Artista {
  id: string;
  nome: string;
  cpf: string;
  rg?: string | null;
  telefone: string;
  email?: string | null;
  endereco?: string | null;
  dataNascimento?: Date | null;
  escolaridade?: string | null;
  experienciaArtistica?: string | null;
  redesSociais?: string | null;
  observacoes?: string | null;
  generoArtistico: string;
  foto?: string | null;
  status: "ATIVO" | "INATIVO";
  destaque: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao?: string | null;
  data: Date;
  hora: string;
  local: string;
  tipo: string;
  cor?: string | null;
  artistaId?: string | null;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Depoimento {
  id: string;
  nome: string;
  genero: string;
  texto: string;
  avatar?: string | null;
  ativo: boolean;
  ordem: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
  createdAt: Date;
  updatedAt: Date;
}
