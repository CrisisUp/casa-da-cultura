/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, PUT, DELETE } from '../route';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    evento: {
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

describe('GET /api/eventos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna evento por ID com artista', async () => {
    (prisma.evento.findUnique as jest.Mock).mockResolvedValue({ id: '123', titulo: 'Show', artista: { id: '456', nome: 'João' } });

    const res = await GET(makeGetRequest('http://localhost:3000/api/eventos/123'), mockParams('123'));
    const data = await res.json();

    expect(data.id).toBe('123');
    expect(data.artista.nome).toBe('João');
  });

  it('retorna 404 quando não encontrado', async () => {
    (prisma.evento.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest('http://localhost:3000/api/eventos/999'), mockParams('999'));
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.evento.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await GET(makeGetRequest('http://localhost:3000/api/eventos/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/eventos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = { titulo: 'Show Atualizado', data: '2026-10-15', hora: '19:00', local: 'Teatro', tipo: 'Música' };

  it('atualiza evento', async () => {
    (prisma.evento.update as jest.Mock).mockResolvedValue({ id: '123', ...valid });

    const res = await PUT(makePutRequest('http://localhost:3000/api/eventos/123', valid), mockParams('123'));
    const data = await res.json();

    expect(data.titulo).toBe('Show Atualizado');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await PUT(makePutRequest('http://localhost:3000/api/eventos/123', { titulo: 'AB' }), mockParams('123'));
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.evento.update as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await PUT(makePutRequest('http://localhost:3000/api/eventos/123', valid), mockParams('123'));
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/eventos/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deleta evento existente', async () => {
    (prisma.evento.findUnique as jest.Mock).mockResolvedValue({ id: '123', titulo: 'Show' });
    (prisma.evento.delete as jest.Mock).mockResolvedValue({ id: '123' });

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/eventos/123'), mockParams('123'));
    const data = await res.json();

    expect(data.message).toBe('Evento removido');
  });

  it('retorna 404 para inexistente', async () => {
    (prisma.evento.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/eventos/999'), mockParams('999'));
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.evento.findUnique as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await DELETE(makeDeleteRequest('http://localhost:3000/api/eventos/123'), mockParams('123'));
    expect(res.status).toBe(500);
  });
});
