"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, User, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
  createdAt: string;
}

const ROLES = [
  { value: "OPERATOR", label: "Operador" },
  { value: "ADMIN", label: "Administrador" },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("OPERATOR");

  async function fetchUsuarios() {
    setLoading(true);
    const res = await fetch("/api/usuarios");
    if (res.ok) {
      const data = await res.json();
      setUsuarios(data.usuarios);
    } else {
      toast.error("Erro ao carregar usuários");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Erro ao criar usuário");
      return;
    }

    toast.success("Usuário criado com sucesso!");
    setShowModal(false);
    setName("");
    setEmail("");
    setPassword("");
    setRole("OPERATOR");
    fetchUsuarios();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Erro ao remover usuário");
      return;
    }

    toast.success("Usuário removido com sucesso!");
    fetchUsuarios();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">Gestão de Usuários e Permissões</h2>
          <p className="text-madeira/70 dark:text-areia/70">
            Gerencie quem tem acesso ao sistema e seus respectivos níveis de privilégio (RBAC)
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {loading ? (
        <div className="cultural-card p-12 text-center">
          <p className="text-madeira/60 dark:text-areia/70">Carregando usuários...</p>
        </div>
      ) : (
        <div className="cultural-card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-areia dark:border-areia/20 bg-areia/20 dark:bg-[#1a120b]">
                <th className="px-4 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">Perfil</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-madeira/80 dark:text-areia">Criado em</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-madeira/80 dark:text-areia">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-areia/50 dark:divide-areia/20">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-areia/10 dark:hover:bg-areia/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-terracota/10 dark:bg-terracota/20 flex items-center justify-center text-terracota font-semibold">
                        {user.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <span className="font-medium text-foreground dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-madeira/70 dark:text-areia/70">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === "ADMIN" ? "success" : "warning"}>
                      {user.role === "ADMIN" ? "Administrador" : "Operador"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-madeira/70 dark:text-areia/70">{formatDate(new Date(user.createdAt))}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-lg p-2 text-madeira/40 hover:bg-danger/10 hover:text-danger transition-colors"
                      title="Remover usuário"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Novo Usuário */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#150e09] p-6 shadow-xl border border-areia dark:border-areia/25 space-y-4">
            <h3 className="text-xl font-bold text-foreground dark:text-white font-[family-name:var(--font-playfair)]">Cadastrar Novo Usuário</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <Input
                label="Nome Completo *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Senha *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Select
                label="Perfil de Acesso *"
                options={ROLES}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Usuário"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
