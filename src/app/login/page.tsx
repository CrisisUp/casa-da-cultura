"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Palette, Loader2, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha inválidos");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Ilustração */}
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-primary-dark via-primary to-secondary relative overflow-hidden">
        {/* Decorações */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-accent/20" />
        <div className="absolute right-1/4 bottom-1/3 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative z-10 text-center px-8">
          <div className="mb-8 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl">
              <Palette className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Casa da Cultura
          </h1>
          <p className="text-xl text-blue-200 max-w-md">
            Sistema de Cadastro de Artistas
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {["Música", "Dança", "Teatro", "Artes"].map((genero) => (
              <span
                key={genero}
                className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm"
              >
                {genero}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Casa da Cultura</h2>
              <p className="text-xs text-gray-500">Sistema de Cadastro</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Bem-vindo!</h2>
              <p className="mt-2 text-gray-500">
                Faça login para acessar o sistema
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Esqueceu a senha?{" "}
                <a href="#" className="text-primary hover:text-primary-dark font-medium">
                  Fale com o administrador
                </a>
              </p>
            </div>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100">
            <p className="text-xs font-medium text-blue-800 mb-2">Credenciais de teste:</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p><strong>Admin:</strong> admin@casa.gov.br / admin123</p>
              <p><strong>Operador:</strong> operador@casa.gov.br / operador123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
