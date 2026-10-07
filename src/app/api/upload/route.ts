import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Whitelist de tipos MIME permitidos com suas extensões válidas
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
};

export async function POST(request: NextRequest) {
  try {
    // Extrair IP do cliente para rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Aplicar rate limiting
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em alguns minutos." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande (máx 5MB, enviado ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 413 }
      );
    }

    // Validar MIME type contra whitelist
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF" },
        { status: 415 }
      );
    }

    // Extrair extensão original e validar contra MIME type
    const originalExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const validExtensionsForMime = ALLOWED_TYPES[file.type];

    if (!validExtensionsForMime.includes(originalExt)) {
      return NextResponse.json(
        { error: "Extensão do arquivo não corresponde ao tipo MIME. Arquivo pode estar corrompido ou falsificado." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Usar extensão validada (do whitelist) com UUID
    const filename = `${randomUUID()}.${originalExt}`;
    const uploadDir = join(process.cwd(), "public/uploads");
    const filepath = join(uploadDir, filename);

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(filepath, buffer);
    console.log(`[AUDIT] Arquivo enviado: ${filename} (${(file.size / 1024).toFixed(1)}KB, MIME: ${file.type})`);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao processar arquivo" },
      { status: 500 }
    );
  }
}
