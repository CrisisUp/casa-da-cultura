/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, POST } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    evento: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

function makeGetRequest(url: string) {
  return new NextRequest(url) as any;
}

function makePostRequest(url: string, body: object) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as any;
}

describe('GET /api/eventos', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna eventos ativos com paginação', async () => {
    (prisma.evento.findMany as jest.Mock).mockResolvedValue([{ id: '1', titulo: 'Show' }]);
    (prisma.evento.count as jest.Mock).mockResolvedValue(1);

    const res = await GET(makeGetRequest('http://localhost:3000/api/eventos'));
    const data = await res.json();

    expect(data.eventos).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it('retorna todos quando all=true', async () => {
    (prisma.evento.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.evento.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/eventos?all=true'));

    expect(prisma.evento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it('filtra eventos futuros com proximos=true', async () => {
    (prisma.evento.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.evento.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/eventos?proximos=true'));

    expect(prisma.evento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ data: expect.objectContaining({ gte: expect.any(Date) }) }),
      })
    );
  });

  it('aplica paginação', async () => {
    (prisma.evento.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.evento.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/eventos?page=2&limit=5'));

    expect(prisma.evento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    );
  });
});

describe('POST /api/eventos', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = {
    titulo: 'Apresentação de Música',
    data: '2026-10-15',
    hora: '19:00',
    local: 'Teatro Municipal',
    tipo: 'Música',
  };

  it('cria evento com dados válidos', async () => {
    const created = { id: '1', ...valid, ativo: true };
    (prisma.evento.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makePostRequest('http://localhost:3000/api/eventos', valid));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.titulo).toBe('Apresentação de Música');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await POST(makePostRequest('http://localhost:3000/api/eventos', { titulo: 'AB' }));
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.evento.create as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await POST(makePostRequest('http://localhost:3000/api/eventos', valid));
    expect(res.status).toBe(500);
  });
});
