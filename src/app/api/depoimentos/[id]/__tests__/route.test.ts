/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, PUT, DELETE } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    depoimento: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

function makeGetRequest(url: string) {
  return new NextRequest(url) as any;
}

function makePutRequest(url: string, body: object) {
  return new NextRequest(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as any;
}

function makeDeleteRequest(url: string) {
  return new NextRequest(url, { method: 'DELETE' }) as any;
}

const mockParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe('GET /api/depoimentos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna depoimento por ID', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockResolvedValue({ id: '123', nome: 'Maria' });

    const res = await GET(makeGetRequest('http://localhost:3000/api/depoimentos/123'), mockParams('123'));
    const data = await res.json();

    expect(data.id).toBe('123');
  });

  it('retorna 404 quando não encontrado', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest('http://localhost:3000/api/depoimentos/999'), mockParams('999'));

    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await GET(makeGetRequest('http://localhost:3000/api/depoimentos/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/depoimentos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = { nome: 'Maria Silva', genero: 'Feminino', texto: 'Texto atualizado com mais de 10 caracteres' };

  it('atualiza depoimento', async () => {
    (prisma.depoimento.update as jest.Mock).mockResolvedValue({ id: '123', ...valid });

    const res = await PUT(makePutRequest('http://localhost:3000/api/depoimentos/123', valid), mockParams('123'));
    const data = await res.json();

    expect(data.nome).toBe('Maria Silva');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await PUT(makePutRequest('http://localhost:3000/api/depoimentos/123', { nome: 'AB' }), mockParams('123'));
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.depoimento.update as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await PUT(makePutRequest('http://localhost:3000/api/depoimentos/123', valid), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/depoimentos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deleta depoimento existente', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockResolvedValue({ id: '123', nome: 'Maria' });
    (prisma.depoimento.delete as jest.Mock).mockResolvedValue({ id: '123' });

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/depoimentos/123'), mockParams('123'));
    const data = await res.json();

    expect(data.message).toBe('Depoimento removido');
  });

  it('retorna 404 para inexistente', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/depoimentos/999'), mockParams('999'));
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.depoimento.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/depoimentos/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});
