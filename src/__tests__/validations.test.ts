import { artistaSchema, depoimentoSchema, eventoSchema } from "@/lib/validations";

describe("Zod Validation Schemas", () => {
  describe("artistaSchema", () => {
    it("should validate a valid artist", () => {
      const validData = {
        nome: "Maria Silva",
        cpf: "123.456.789-01",
        telefone: "(11) 98888-7777",
        generoArtistico: "Música",
      };

      const result = artistaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail on invalid CPF format", () => {
      const invalidData = {
        nome: "Maria Silva",
        cpf: "12345678901", // Missing dots and dash
        telefone: "(11) 98888-7777",
        generoArtistico: "Música",
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("cpf");
      }
    });

    it("should fail when missing required generoArtistico", () => {
      const invalidData = {
        nome: "Maria Silva",
        cpf: "123.456.789-01",
        telefone: "(11) 98888-7777",
        generoArtistico: "",
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("depoimentoSchema", () => {
    it("should validate a valid depoimento", () => {
      const validData = {
        nome: "João",
        genero: "Teatro",
        texto: "Participar da Casa da Cultura mudou minha vida artística.",
      };

      const result = depoimentoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when texto is too short", () => {
      const invalidData = {
        nome: "João",
        genero: "Teatro",
        texto: "Curto",
      };

      const result = depoimentoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("eventoSchema", () => {
    it("should validate a valid evento", () => {
      const validData = {
        titulo: "Festival de Verão",
        data: "2026-10-15",
        hora: "19:00",
        local: "Auditório Principal",
        tipo: "Música",
      };

      const result = eventoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail on invalid time format", () => {
      const invalidData = {
        titulo: "Festival de Verão",
        data: "2026-10-15",
        hora: "19h00", // Invalid format
        local: "Auditório Principal",
        tipo: "Música",
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
