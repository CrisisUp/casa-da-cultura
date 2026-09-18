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

export function handleApiError(error: unknown, action: string = "processar requisição") {
  console.error(`Erro ao ${action}:`, error);
  if (error instanceof Error && error.name === "ZodError") {
    return Response.json({ success: false, error: "Dados inválidos", details: error }, { status: 400 });
  }
  // Check Prisma unique constraint violation (P2002)
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    return Response.json({ success: false, error: "Registro já cadastrado" }, { status: 400 });
  }
  return Response.json({ success: false, error: `Erro ao ${action}` }, { status: 500 });
}
