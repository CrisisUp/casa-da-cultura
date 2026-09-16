import { artistaSchema, depoimentoSchema, eventoSchema } from '../validations';

describe('artistaSchema', () => {
  describe('validação bem-sucedida', () => {
    it('aceita artista válido com todos campos obrigatórios', () => {
      const validData = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        generoArtistico: 'Música',
      };

      const result = artistaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('aceita artista com campos opcionais vazios', () => {
      const validData = {
        nome: 'Maria Santos',
        cpf: '987.654.321-11',
        telefone: '(21) 98765-4321',
        generoArtistico: 'Dança',
        rg: '',
        email: '',
        endereco: '',
        escolaridade: '',
        experienciaArtistica: '',
        redesSociais: '',
        observacoes: '',
        foto: '',
      };

      const result = artistaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('validação com falha - CPF', () => {
    it('rejeita CPF com menos de 14 caracteres', () => {
      const invalidData = {
        nome: 'João Silva',
        cpf: '123',
        telefone: '(11) 98765-4321',
        generoArtistico: 'Música',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('CPF');
    });

    it('rejeita CPF sem formato correto', () => {
      const invalidData = {
        nome: 'João Silva',
        cpf: '12345678900',
        telefone: '(11) 98765-4321',
        generoArtistico: 'Música',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validação com falha - Nome', () => {
    it('rejeita nome com menos de 3 caracteres', () => {
      const invalidData = {
        nome: 'AB',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        generoArtistico: 'Música',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('3 caracteres');
    });
  });

  describe('validação com falha - Telefone', () => {
    it('rejeita telefone com formato inválido', () => {
      const invalidData = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '11987654321',
        generoArtistico: 'Música',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validação com falha - Gênero', () => {
    it('rejeita gênero artístico vazio', () => {
      const invalidData = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        generoArtistico: '',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validação com falha - Email', () => {
    it('rejeita email inválido', () => {
      const invalidData = {
        nome: 'João Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        generoArtistico: 'Música',
        email: 'not-an-email',
      };

      const result = artistaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('depoimentoSchema', () => {
  describe('validação bem-sucedida', () => {
    it('aceita depoimento válido', () => {
      const validData = {
        nome: 'Maria Silva',
        genero: 'Dança',
        texto: 'Esse programa mudou minha vida profissional e pessoal completamente.',
        avatar: 'MS',
        ativo: true,
        ordem: 1,
      };

      const result = depoimentoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('aceita depoimento sem avatar e ordem', () => {
      const validData = {
        nome: 'João Santos',
        genero: 'Teatro',
        texto: 'Uma experiência absolutamente transformadora para mim e minha carreira.',
        ativo: true,
      };

      const result = depoimentoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('validação com falha', () => {
    it('rejeita nome com menos de 3 caracteres', () => {
      const invalidData = {
        nome: 'AB',
        genero: 'Música',
        texto: 'Um texto valido para depoimento com mais de dez caracteres',
      };

      const result = depoimentoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita gênero vazio', () => {
      const invalidData = {
        nome: 'João',
        genero: '',
        texto: 'Um texto valido para depoimento com mais de dez caracteres',
      };

      const result = depoimentoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita texto com menos de 10 caracteres', () => {
      const invalidData = {
        nome: 'João Silva',
        genero: 'Música',
        texto: 'Curto',
      };

      const result = depoimentoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('10 caracteres');
    });
  });
});

describe('eventoSchema', () => {
  describe('validação bem-sucedida', () => {
    it('aceita evento válido com todos campos', () => {
      const validData = {
        titulo: 'Apresentação de Música',
        descricao: 'Apresentação ao vivo de artistas locais',
        data: '2026-10-15T19:00:00Z',
        hora: '19:00',
        local: 'Teatro Municipal',
        tipo: 'Música',
        cor: 'bg-terracota',
        artistaId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        ativo: true,
      };

      const result = eventoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('aceita evento sem artistaId', () => {
      const validData = {
        titulo: 'Workshop de Dança',
        data: '2026-10-20T14:00:00.000Z',
        hora: '14:00',
        local: 'Estúdio de Dança',
        tipo: 'Dança',
        ativo: true,
      };

      const result = eventoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('validação com falha', () => {
    it('rejeita título com menos de 3 caracteres', () => {
      const invalidData = {
        titulo: 'AB',
        data: '2026-10-15T19:00:00.000Z',
        hora: '19:00',
        local: 'Teatro',
        tipo: 'Música',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita hora com formato inválido (sem dois pontos)', () => {
      const invalidData = {
        titulo: 'Apresentação',
        data: '2026-10-15T19:00:00.000Z',
        hora: '1900',
        local: 'Teatro',
        tipo: 'Música',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita hora com mais dígitos', () => {
      const invalidData = {
        titulo: 'Apresentação',
        data: '2026-10-15T19:00:00.000Z',
        hora: '190000',
        local: 'Teatro',
        tipo: 'Música',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita local com menos de 3 caracteres', () => {
      const invalidData = {
        titulo: 'Apresentação',
        data: '2026-10-15T19:00:00.000Z',
        hora: '19:00',
        local: 'AB',
        tipo: 'Música',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita tipo vazio', () => {
      const invalidData = {
        titulo: 'Apresentação',
        data: '2026-10-15T19:00:00.000Z',
        hora: '19:00',
        local: 'Teatro',
        tipo: '',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejeita data inválida', () => {
      const invalidData = {
        titulo: 'Apresentação',
        data: 'not-a-date',
        hora: '19:00',
        local: 'Teatro',
        tipo: 'Música',
        ativo: true,
      };

      const result = eventoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
