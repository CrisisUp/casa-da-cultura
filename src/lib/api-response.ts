import { ZodError } from "zod";

export function formatResponse(data: any, pagination?: any, meta?: any) {
  return {
    success: true,
    data,
    ...(pagination && { pagination }),
    ...(meta && { meta }),
  };
}

export function formatError(message: string, status: number = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function handleApiError(
  error: unknown,
  action: string = "processar requisição"
) {
  console.error(`Erro ao ${action}:`, error);

  // Erro de validação do Zod
  if (
    error instanceof ZodError ||
    (typeof error === "object" &&
      error !== null &&
      (error as any).name === "ZodError")
  ) {
    const issues = (error as any).issues ?? [];
    return Response.json(
      {
        success: false,
        error: "Dados inválidos",
        details: issues.map(
          (i: any) => `${i.path.join(".")}: ${i.message}`
        ),
      },
      { status: 400 }
    );
  }

  // Violação de constraint única do Prisma (P2002)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code === "P2002"
  ) {
    return Response.json(
      { success: false, error: "Registro já cadastrado" },
      { status: 400 }
    );
  }

  return Response.json(
    { success: false, error: `Erro ao ${action}` },
    { status: 500 }
  );
}