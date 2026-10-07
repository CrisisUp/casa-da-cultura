import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";
import { formatResponse, handleApiError } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const all = searchParams.get("all") === "true";
    const proximos = searchParams.get("proximos") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (!all) {
      where.ativo = true;
    }

    if (proximos) {
      where.data = { gte: new Date() };
    }

    // Filtrar registros soft-deletados
    where.deletedAt = null;

    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where,
        include: { artista: { select: { id: true, nome: true } } },
        orderBy: { data: "asc" },
        skip,
        take: limit,
      }),
      prisma.evento.count({ where }),
    ]);

    return NextResponse.json(
      formatResponse(eventos, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    return handleApiError(error, "buscar eventos");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "OPERATOR")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    const validated = eventoSchema.parse(body);

    const evento = await prisma.evento.create({
      data: {
        ...validated,
        data: new Date(validated.data),
      },
    });

    return NextResponse.json(formatResponse(evento), { status: 201 });
  } catch (error) {
    return handleApiError(error, "criar evento");
  }
}
