import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventoSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
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

  return NextResponse.json({
    eventos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = eventoSchema.parse(body);

    const evento = await prisma.evento.create({
      data: {
        ...validated,
        data: new Date(validated.data),
      },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    return handleApiError(error, "criar evento");
  }
}
