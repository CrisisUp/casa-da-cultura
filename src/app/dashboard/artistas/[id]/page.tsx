import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCPF, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Pencil, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArtistaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const artista = await prisma.artista.findUnique({
    where: { id },
  });

  if (!artista) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/artistas"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{artista.nome}</h2>
            <p className="text-gray-500">{artista.generoArtistico}</p>
          </div>
        </div>
        <Link href={`/dashboard/artistas/${artista.id}/editar`}>
          <Button variant="secondary">
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {artista.foto ? (
              <img
                src={artista.foto}
                alt={artista.nome}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {artista.nome.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Badge variant={artista.status === "ATIVO" ? "success" : "danger"}>
                {artista.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium">{formatCPF(artista.cpf)}</p>
              </div>
              {artista.rg && (
                <div>
                  <p className="text-sm text-gray-500">RG</p>
                  <p className="font-medium">{artista.rg}</p>
                </div>
              )}
              {artista.dataNascimento && (
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">
                    {formatDate(artista.dataNascimento)}
                  </p>
                </div>
              )}
              {artista.escolaridade && (
                <div>
                  <p className="text-sm text-gray-500">Escolaridade</p>
                  <p className="font-medium">{artista.escolaridade}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-4 font-medium text-gray-900">Contato</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{artista.telefone}</span>
          </div>
          {artista.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{artista.email}</span>
            </div>
          )}
          {artista.endereco && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{artista.endereco}</span>
            </div>
          )}
        </div>
      </div>

      {artista.experienciaArtistica && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-2 font-medium text-gray-900">Experiência Artística</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {artista.experienciaArtistica}
          </p>
        </div>
      )}

      {artista.redesSociais && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-2 font-medium text-gray-900">Redes Sociais</h3>
          <p className="text-gray-600">{artista.redesSociais}</p>
        </div>
      )}

      {artista.observacoes && (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-2 font-medium text-gray-900">Observações</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {artista.observacoes}
          </p>
        </div>
      )}

      <div className="text-sm text-gray-400">
        Cadastrado em: {formatDate(artista.createdAt)}
      </div>
    </div>
  );
}
