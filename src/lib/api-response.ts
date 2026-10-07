import { ZodError } from "zod";

export function formatResponse<T>(
  data: T,
  pagination?: { page: number; limit: number; total: number; totalPages: number },
  meta?: Record<string, unknown>
) {
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
      "name" in error &&
      (error as Record<string, unknown>).name === "ZodError")
  ) {
    const issues =
      (error as { issues?: Array<{ path: (string | number)[]; message: string }> }).issues ?? [];
    return Response.json(
      {
        success: false,
        error: "Dados inválidos",
        details: issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      },
      { status: 400 }
    );
  }

  // Violação de constraint única do Prisma (P2002)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as Record<string, unknown>).code === "P2002"
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