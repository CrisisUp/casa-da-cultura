require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Polyfill Web API para Node environment (jest)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill global Request/Response/Headers se não existirem
if (typeof globalThis.Request === 'undefined') {
  const { Request, Response, Headers } = require('node-fetch');
  globalThis.Request = Request;
  globalThis.Response = Response;
  globalThis.Headers = Headers;
  globalThis.fetch = require('node-fetch');
}

// Mock de environment variables
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Suprimir logs durante testes
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};;
