require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Polyfill Web API para Node environment (jest)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Node.js 18+ has Request/Response/Headers/fetch natively
// jsdom environment doesn't expose them, so we polyfill from node globals
if (typeof globalThis.Request === 'undefined') {
  const nf = require('node:http');
  // Fallback: use undici or native fetch if available
  try {
    const undici = require('undici');
    globalThis.Request = undici.Request;
    globalThis.Response = undici.Response;
    globalThis.Headers = undici.Headers;
    globalThis.fetch = undici.fetch;
  } catch {
    // Last resort: minimal stubs that throw on use
    console.warn('Warning: Web APIs not available. API route tests may fail.');
  }
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
};
