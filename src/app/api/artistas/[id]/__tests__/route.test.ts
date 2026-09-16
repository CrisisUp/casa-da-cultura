/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, PUT, DELETE } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    artista: {
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

describe('GET /api/artistas/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna artista por ID', async () => {
    (prisma.artista.findUnique as jest.Mock).mockResolvedValue({ id: '123', nome: 'João' });

    const res = await GET(makeGetRequest('http://localhost:3000/api/artistas/123'), mockParams('123'));
    const data = await res.json();

    expect(data.id).toBe('123');
  });

  it('retorna 404 quando não encontrado', async () => {
    (prisma.artista.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest('http://localhost:3000/api/artistas/999'), mockParams('999'));
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.artista.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await GET(makeGetRequest('http://localhost:3000/api/artistas/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/artistas/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = { nome: 'João Atualizado', cpf: '123.456.789-00', telefone: '(11) 98765-4321', generoArtistico: 'Música' };

  it('atualiza artista', async () => {
    (prisma.artista.update as jest.Mock).mockResolvedValue({ id: '123', ...valid });

    const res = await PUT(makePutRequest('http://localhost:3000/api/artistas/123', valid), mockParams('123'));
    const data = await res.json();

    expect(data.nome).toBe('João Atualizado');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await PUT(makePutRequest('http://localhost:3000/api/artistas/123', { nome: 'AB' }), mockParams('123'));
    expect(res.status).toBe(400);
  });

  it('retorna 400 para CPF duplicado', async () => {
    const err = new Error('Unique') as any;
    err.code = 'P2002';
    (prisma.artista.update as jest.Mock).mockRejectedValue(err);

    const res = await PUT(makePutRequest('http://localhost:3000/api/artistas/123', valid), mockParams('123'));
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.artista.update as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await PUT(makePutRequest('http://localhost:3000/api/artistas/123', valid), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/artistas/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deleta artista existente', async () => {
    (prisma.artista.findUnique as jest.Mock).mockResolvedValue({ id: '123', nome: 'João' });
    (prisma.artista.delete as jest.Mock).mockResolvedValue({ id: '123' });

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/artistas/123'), mockParams('123'));
    const data = await res.json();

    expect(data.message).toBe('Artista removido');
  });

  it('retorna 404 para inexistente', async () => {
    (prisma.artista.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/artistas/999'), mockParams('999'));
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.artista.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/artistas/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});
