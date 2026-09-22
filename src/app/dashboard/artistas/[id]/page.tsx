import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { statusBadgeVariant } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatCPF, formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, MapPin, Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/artistas"
            className="rounded-lg p-2 text-muted hover:bg-areia/40 dark:hover:bg-areia/20 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              {artista.nome}
            </h2>
            <p className="text-muted font-medium">{artista.generoArtistico}</p>
          </div>
        </div>
        <Link href={`/dashboard/artistas/${artista.id}/editar`}>
          <Button variant="secondary">
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Dados principais */}
      <div className="cultural-card p-6">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-areia/40 dark:bg-areia/20 overflow-hidden flex items-center justify-center shrink-0 border border-border">
            {artista.foto ? (
              <img
                src={artista.foto}
                alt={artista.nome}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-terracota">
                {artista.nome.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Badge variant={statusBadgeVariant(artista.status)}>
                {artista.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted">CPF</p>
                <p className="font-medium text-foreground">
                  {formatCPF(artista.cpf)}
                </p>
              </div>
              {artista.rg && (
                <div>
                  <p className="text-sm text-muted">RG</p>
                  <p className="font-medium text-foreground">{artista.rg}</p>
                </div>
              )}
              {artista.dataNascimento && (
                <div>
                  <p className="text-sm text-muted">Data de Nascimento</p>
                  <p className="font-medium text-foreground">
                    {formatDate(artista.dataNascimento)}
                  </p>
                </div>
              )}
              {artista.escolaridade && (
                <div>
                  <p className="text-sm text-muted">Escolaridade</p>
                  <p className="font-medium text-foreground">
                    {artista.escolaridade}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="cultural-card p-6">
        <h3 className="mb-4 font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          Contato
        </h3>
        <div className="space-y-3 text-foreground">
          {artista.telefone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-terracota shrink-0" />
              <span>{artista.telefone}</span>
            </div>
          )}
          {artista.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-terracota shrink-0" />
              <span>{artista.email}</span>
            </div>
          )}
          {artista.endereco && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-terracota shrink-0" />
              <span>{artista.endereco}</span>
            </div>
          )}
        </div>
      </div>

      {/* Experiência Artística */}
      {artista.experienciaArtistica && (
        <div className="cultural-card p-6">
          <h3 className="mb-2 font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            Experiência Artística
          </h3>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {artista.experienciaArtistica}
          </p>
        </div>
      )}

      {/* Redes Sociais */}
      {artista.redesSociais && (
        <div className="cultural-card p-6">
          <h3 className="mb-2 font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            Redes Sociais
          </h3>
          <p className="text-foreground">{artista.redesSociais}</p>
        </div>
      )}

      {/* Observações */}
      {artista.observacoes && (
        <div className="cultural-card p-6">
          <h3 className="mb-2 font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            Observações
          </h3>
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {artista.observacoes}
          </p>
        </div>
      )}

      {/* Rodapé */}
      <div className="text-sm text-muted">
        Cadastrado em: {formatDate(artista.createdAt)}
      </div>
    </div>
  );
}