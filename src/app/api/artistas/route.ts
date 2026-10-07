import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { artistaSchema } from "@/lib/validations";
import { formatResponse, handleApiError } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const genero = searchParams.get("genero") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genero) {
      where.generoArtistico = genero;
    }

    if (status) {
      where.status = status;
    }

    // Filtrar registros soft-deletados
    where.deletedAt = null;

    const [artistas, total] = await Promise.all([
      prisma.artista.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.artista.count({ where }),
    ]);

    return NextResponse.json(
      formatResponse(artistas, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    return handleApiError(error, "buscar artistas");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const validated = artistaSchema.parse(body);

    const artista = await prisma.artista.create({
      data: {
        nome: validated.nome,
        cpf: validated.cpf.replace(/\D/g, ""),
        rg: validated.rg || undefined,
        telefone: validated.telefone.replace(/\D/g, ""),
        email: validated.email || undefined,
        endereco: validated.endereco || undefined,
        dataNascimento: validated.dataNascimento
          ? new Date(validated.dataNascimento)
          : null,
        escolaridade: validated.escolaridade || undefined,
        experienciaArtistica: validated.experienciaArtistica || undefined,
        redesSociais: validated.redesSociais || undefined,
        observacoes: validated.observacoes || undefined,
        generoArtistico: validated.generoArtistico,
        foto: validated.foto || undefined,
      },
    });

    return NextResponse.json(formatResponse(artista), { status: 201 });
  } catch (error) {
    return handleApiError(error, "criar artista");
  }
}
