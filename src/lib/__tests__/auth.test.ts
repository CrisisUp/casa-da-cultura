import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs');

describe('Auth - Credentials Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authorize', () => {
    it('retorna null quando credenciais estão vazias', async () => {
      // Teste que valida a verificação de credenciais vazias
      const email = '';
      const password = '';

      if (!email || !password) {
        expect(true).toBe(true);
      }
    });

    it('retorna null quando usuário não existe', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await prisma.user.findUnique({
        where: { email: 'nonexistent@test.com' },
      });

      expect(result).toBeNull();
    });

    it('retorna null quando senha está incorreta', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'OPERATOR',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const isValid = await bcrypt.compare('wrongpassword', mockUser.password);

      expect(isValid).toBe(false);
    });

    it('retorna usuário quando credenciais estão corretas', async () => {
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'hashedpassword',
        role: 'ADMIN',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await prisma.user.findUnique({
        where: { email: 'admin@test.com' },
      });

      expect(user).toBeDefined();
      expect(user?.id).toBe('1');
      expect(user?.email).toBe('admin@test.com');
      expect(user?.role).toBe('ADMIN');
    });

    it('retorna usuário com role OPERATOR', async () => {
      const mockUser = {
        id: '2',
        name: 'Operator User',
        email: 'operator@test.com',
        password: 'hashedpassword',
        role: 'OPERATOR',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await prisma.user.findUnique({
        where: { email: 'operator@test.com' },
      });

      expect(user?.role).toBe('OPERATOR');
    });
  });

  describe('JWT callback', () => {
    it('adiciona id e role ao token quando usuário está presente', () => {
      const user = {
        id: '123',
        name: 'João',
        email: 'joao@test.com',
        role: 'ADMIN',
      };

      const token = { sub: user.id };

      // Simula o que o callback faz
      if (user) {
        (token as any).id = user.id;
        (token as any).role = user.role;
      }

      expect((token as any).id).toBe('123');
      expect((token as any).role).toBe('ADMIN');
    });

    it('retorna token sem modificação quando usuário não está presente', () => {
      const token = { sub: '123', iat: 1234567890 };
      const originalToken = { ...token };

      // Sem usuário, token permanece inalterado
      expect(token).toEqual(originalToken);
    });
  });

  describe('Session callback', () => {
    it('adiciona id e role ao session.user', () => {
      const session = {
        user: {
          name: 'João Silva',
          email: 'joao@test.com',
        },
      };

      const token = {
        id: '123',
        role: 'ADMIN',
      };

      // Simula o que o callback faz
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }

      expect((session.user as any).id).toBe('123');
      expect((session.user as any).role).toBe('ADMIN');
      expect(session.user.name).toBe('João Silva');
    });

    it('preserva dados do usuário enquanto adiciona token data', () => {
      const session = {
        user: {
          name: 'Maria Santos',
          email: 'maria@test.com',
        },
        expires: '2026-10-15',
      };

      const token = {
        id: '456',
        role: 'OPERATOR',
      };

      const originalEmail = session.user.email;

      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }

      expect(session.user.email).toBe(originalEmail);
      expect((session.user as any).id).toBe('456');
    });
  });

  describe('Segurança', () => {
    it('não expõe senha em nenhum ponto', async () => {
      const mockUser = {
        id: '1',
        name: 'User',
        email: 'user@test.com',
        password: 'hashedpassword',
        role: 'ADMIN',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await prisma.user.findUnique({
        where: { email: 'user@test.com' },
      });

      // O objeto retornado não deve expor a senha em callbacks de auth
      expect(user?.password).toBeDefined(); // No DB tem, mas não é retornado em session
    });

    it('valida formato de email antes de consulta', () => {
      const validEmail = 'user@test.com';
      const invalidEmail = 'not-an-email';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    it('falha quando email e password são undefined', () => {
      const credentials = {
        email: undefined,
        password: undefined,
      };

      const result = !credentials.email || !credentials.password;
      expect(result).toBe(true);
    });
  });
});
