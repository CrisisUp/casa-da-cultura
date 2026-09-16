/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, POST } from '../route';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    artista: {
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

function makePrismaUniqueError(): PrismaClientKnownRequestError {
  const error = new PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: '6.0.0',
  });
  return error;
}

describe('GET /api/artistas', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna lista de artistas com paginação', async () => {
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([{ id: '1', nome: 'João' }]);
    (prisma.artista.count as jest.Mock).mockResolvedValue(1);

    const res = await GET(makeGetRequest('http://localhost:3000/api/artistas'));
    const data = await res.json();

    expect(data.artistas).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it('aplica paginação corretamente', async () => {
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.artista.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/artistas?page=3&limit=5'));

    expect(prisma.artista.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 5 })
    );
  });

  it('filtra por busca', async () => {
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.artista.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/artistas?search=João'));

    expect(prisma.artista.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ nome: expect.objectContaining({ contains: 'João' }) }),
          ]),
        }),
      })
    );
  });

  it('filtra por gênero', async () => {
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.artista.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/artistas?genero=Música'));

    expect(prisma.artista.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ generoArtistico: 'Música' }),
      })
    );
  });

  it('filtra por status', async () => {
    (prisma.artista.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.artista.count as jest.Mock).mockResolvedValue(0);

    await GET(makeGetRequest('http://localhost:3000/api/artistas?status=ativo'));

    expect(prisma.artista.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: 'ativo' }),
      })
    );
  });
});

describe('POST /api/artistas', () => {
  beforeEach(() => jest.clearAllMocks());

  const valid = {
    nome: 'João Silva',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    generoArtistico: 'Música',
  };

  it('cria artista com dados válidos', async () => {
    const created = { id: '1', ...valid };
    (prisma.artista.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makePostRequest('http://localhost:3000/api/artistas', valid));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.id).toBe('1');
  });

  it('retorna 400 para dados inválidos', async () => {
    const res = await POST(makePostRequest('http://localhost:3000/api/artistas', { nome: 'AB' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Dados inválidos');
  });

  it('retorna 400 para CPF duplicado', async () => {
    (prisma.artista.create as jest.Mock).mockRejectedValue(makePrismaUniqueError());

    const res = await POST(makePostRequest('http://localhost:3000/api/artistas', valid));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Registro já cadastrado');
  });

  it('retorna 500 em erro interno', async () => {
    (prisma.artista.create as jest.Mock).mockRejectedValue(new Error('DB'));

    const res = await POST(makePostRequest('http://localhost:3000/api/artistas', valid));
    expect(res.status).toBe(500);
  });
});
