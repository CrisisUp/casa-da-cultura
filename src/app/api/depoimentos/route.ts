import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { depoimentoSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get("all") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where = all ? {} : { ativo: true };

  const [depoimentos, total] = await Promise.all([
    prisma.depoimento.findMany({
      where,
      orderBy: { ordem: "asc" },
      skip,
      take: limit,
    }),
    prisma.depoimento.count({ where }),
  ]);

  return NextResponse.json({
    depoimentos,
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
    const validated = depoimentoSchema.parse(body);

    const depoimento = await prisma.depoimento.create({
      data: validated,
    });

    return NextResponse.json(depoimento, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: (error as any).errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar depoimento:", error);
    return NextResponse.json(
      { error: "Erro ao criar depoimento" },
      { status: 500 }
    );
  }
}
