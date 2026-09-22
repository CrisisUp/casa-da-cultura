"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatDate } from "@/lib/utils";
import { Loader2, Shield, Trash2, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  // ✅ Função dentro do useEffect com AbortController
  useEffect(() => {
    const controller = new AbortController();

    async function carregarUsuarios() {
      setLoading(true);
      try {
        const res = await fetch("/api/usuarios", {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (!controller.signal.aborted) {
            setUsuarios(data.usuarios);
          }
        } else {
          toast.error("Erro ao carregar usuários");
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error("Erro ao carregar usuários");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    carregarUsuarios();

    return () => controller.abort();
  }, []);

  // ✅ Função auxiliar reutilizável para re-fetch após ações
  async function refreshUsuarios() {
    const res = await fetch("/api/usuarios");
    if (res.ok) {
      const data = await res.json();
      setUsuarios(data.usuarios);
    }
  }

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
    refreshUsuarios();
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
    refreshUsuarios();
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Gestão de Usuários e Permissões
          </h2>
          <p className="text-muted">
            Gerencie quem tem acesso ao sistema e seus respectivos níveis de
            privilégio (RBAC)
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {loading ? (
        <div className="cultural-card p-12 text-center">
          <p className="text-muted">Carregando usuários...</p>
        </div>
      ) : (
        <div className="cultural-card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-subtle">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Perfil
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  Criado em
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {usuarios.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-subtle transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracota/10 dark:bg-terracota/20 text-terracota font-semibold shrink-0">
                        {user.role === "ADMIN" ? (
                          <Shield className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.role === "ADMIN" ? "success" : "warning"}
                    >
                      {user.role === "ADMIN" ? "Administrador" : "Operador"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {formatDate(new Date(user.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="action-icon action-icon-danger"
                      title="Remover usuário"
                      aria-label={`Remover usuário ${user.name}`}
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

      {/* Modal Novo Usuário — usando .cultural-card para adaptação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="cultural-card w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              Cadastrar Novo Usuário
            </h3>
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Salvar Usuário"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}