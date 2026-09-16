/**
 * Standardized API response wrapper
 * All endpoints should wrap responses in this format
 */

import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, unknown>;
}

export function successResponse<T>(
  data: T,
  pagination?: { page: number; limit: number; total: number; totalPages: number },
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    data,
    ...(pagination && { pagination }),
    ...(meta && { meta }),
  };
}

export function errorResponse(
  error: string,
  details?: unknown
): ApiResponse<never> {
  const response: ApiResponse<never> = { error };
  if (details) response.details = details as any;
  return response;
}

/**
 * Handles common API errors (Zod validation, Prisma unique constraint, generic).
 * Usage: catch (error) { return handleApiError(error, "criar artista") }
 */
export function handleApiError(error: unknown, action: string): NextResponse {
  if (error instanceof Error) {
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "Registro já cadastrado" },
        { status: 400 }
      );
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: (error as any).errors },
        { status: 400 }
      );
    }
  }
  console.error(`Erro ao ${action}:`, error);
  return NextResponse.json(
    { error: `Erro ao ${action}` },
    { status: 500 }
  );
}
