/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '../route';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-uuid-123'),
}));

function makeUploadRequest(formData: FormData) {
  return new NextRequest('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData,
  }) as any;
}

describe('POST /api/upload', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retorna 400 quando nenhum arquivo é enviado', async () => {
    const formData = new FormData();
    const res = await POST(makeUploadRequest(formData));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Nenhum arquivo enviado');
  });

  it('retorna 413 para arquivo maior que 5MB', async () => {
    const formData = new FormData();
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024);
    const file = new File([bigBuffer], 'big.jpg', { type: 'image/jpeg' });
    formData.set('file', file);

    const res = await POST(makeUploadRequest(formData));
    const data = await res.json();

    expect(res.status).toBe(413);
    expect(data.error).toContain('muito grande');
  });

  it('retorna 415 para MIME type não permitido', async () => {
    const formData = new FormData();
    const buffer = Buffer.alloc(1024);
    const file = new File([buffer], 'video.mp4', { type: 'video/mp4' });
    formData.set('file', file);

    const res = await POST(makeUploadRequest(formData));
    const data = await res.json();

    expect(res.status).toBe(415);
    expect(data.error).toContain('não permitido');
  });

  it('faz upload com sucesso para arquivo válido', async () => {
    const formData = new FormData();
    const buffer = Buffer.alloc(1024);
    const file = new File([buffer], 'photo.jpg', { type: 'image/jpeg' });
    formData.set('file', file);

    const res = await POST(makeUploadRequest(formData));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.url).toBe('/uploads/test-uuid-123.jpg');
  });

  it('retorna 500 em erro interno', async () => {
    const { writeFile } = require('fs/promises');
    writeFile.mockRejectedValueOnce(new Error('Disk full'));

    const formData = new FormData();
    const buffer = Buffer.alloc(1024);
    const file = new File([buffer], 'photo.jpg', { type: 'image/jpeg' });
    formData.set('file', file);

    const res = await POST(makeUploadRequest(formData));
    expect(res.status).toBe(500);
  });
});
