/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, POST } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    depoimento: {
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

describe('GET /api/depoimentos', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna depoimentos ativos com paginação', async () => {
    (prisma.depoimento.findMany as jest.Mock).mockResolvedValue([{ id: '1', nome: 'Maria' }]);
    (prisma.depoimento.count as jest.Mock).mockResolvedValue(1);

    const res = await GET(makeGetRequest('http://localhost:3000/api/depoimentos'));
    const data = await res.json();

    expect(data.depoimentos).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it('retorna todos quando all=true', async () => {
    (prisma.depoimento.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.depoimento.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/depoimentos?all=true'));

    expect(prisma.depoimento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it('aplica paginação', async () => {
    (prisma.depoimento.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.depoimento.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/depoimentos?page=2&limit=5'));

    expect(prisma.depoimento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    );
  });
});

describe('POST /api/depoimentos', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = { nome: 'Maria Silva', genero: 'Feminino', texto: 'Excelente experiência artística na casa da cultura' };

  it('cria depoimento com dados válidos', async () => {
    const created = { id: '1', ...valid };
    (prisma.depoimento.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makePostRequest('http://localhost:3000/api/depoimentos', valid));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.nome).toBe('Maria Silva');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await POST(makePostRequest('http://localhost:3000/api/depoimentos', { nome: 'AB' }));
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.depoimento.create as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await POST(makePostRequest('http://localhost:3000/api/depoimentos', valid));
    expect(res.status).toBe(500);
  });
});
