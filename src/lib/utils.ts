export function formatCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export function formatPhone(phone: string): string {
  return phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function classNames(
  ...classes: (string | Record<string, boolean> | undefined | null | false)[]
): string {
  return classes
    .flat()
    .filter((c) => typeof c === "string" || typeof c === "object")
    .map((c) => {
      if (typeof c === "object" && c !== null) {
        return Object.entries(c)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(" ");
      }
      return c;
    })
    .join(" ");
}

export function isValidUUID(id: string): boolean {
  // Prisma usa CUID por padrão (c + 24 caracteres)
  // Também aceitar UUID v4
  const cuidRegex = /^c[a-z0-9]{24}$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return cuidRegex.test(id) || uuidRegex.test(id);
}
