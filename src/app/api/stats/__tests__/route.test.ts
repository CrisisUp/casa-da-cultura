/**
 * @jest-environment node
 */
import { prisma } from '@/lib/prisma';
import { GET } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    artista: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

function makeRequest(url: string) {
  return new Request(url) as any;
}

describe('GET /api/stats', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna estatísticas completas', async () => {
    (prisma.artista.count as jest.Mock)
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(40)
      .mockResolvedValueOnce(10);
    (prisma.artista.groupBy as jest.Mock).mockResolvedValue([
      { generoArtistico: 'Música', _count: 25 },
      { generoArtistico: 'Dança', _count: 15 },
    ]);
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([
      { id: '1', nome: 'João', generoArtistico: 'Música', status: 'ATIVO', createdAt: new Date() },
    ]);

    const req = makeRequest('http://localhost:3000/api/stats');
    const res = await GET();
    const data = await res.json();

    expect(data.total).toBe(50);
    expect(data.ativos).toBe(40);
    expect(data.inativos).toBe(10);
    expect(data.porGenero).toHaveLength(2);
    expect(data.porGenero[0].genero).toBe('Música');
    expect(data.porGenero[0].count).toBe(25);
    expect(data.recentes).toHaveLength(1);
  });

  it('retorna zeros quando não há artistas', async () => {
    (prisma.artista.count as jest.Mock).mockResolvedValue(0);
    (prisma.artista.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data.total).toBe(0);
    expect(data.porGenero).toHaveLength(0);
    expect(data.recentes).toHaveLength(0);
  });
});
