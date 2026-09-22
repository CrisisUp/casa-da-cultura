import { GET } from "@/app/api/stats/route";
import { prisma } from "@/lib/prisma";

// Mock do Prisma Client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    artista: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("API /api/stats", () => {
  it("should return statistics successfully", async () => {
    (prisma.artista.count as jest.Mock).mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(8)  // ativos
      .mockResolvedValueOnce(2); // inativos

    (prisma.artista.groupBy as jest.Mock).mockResolvedValueOnce([
      { generoArtistico: "Música", _count: 5 },
    ]);

    (prisma.artista.findMany as jest.Mock).mockResolvedValueOnce([
      { id: "1", nome: "Artista 1", generoArtistico: "Música", status: "ATIVO", createdAt: new Date() },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(10);
    expect(data.ativos).toBe(8);
    expect(data.inativos).toBe(2);
    expect(data.porGenero).toEqual([{ genero: "Música", count: 5 }]);
    expect(data.recentes).toHaveLength(1);
  });
});
