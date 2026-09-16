import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Badge Component', () => {
  it('renderiza com label', () => {
    render(<span className="badge">ATIVO</span>);
    expect(screen.getByText('ATIVO')).toBeInTheDocument();
  });

  it('aplica classe de variante', () => {
    const { container } = render(
      <span className="badge badge-success">Aprovado</span>
    );
    const badge = container.querySelector('.badge');
    expect(badge).toHaveClass('badge-success');
  });

  it('renderiza com tamanho customizado', () => {
    const { container } = render(
      <span className="badge badge-lg">Grande</span>
    );
    const badge = container.querySelector('.badge');
    expect(badge).toHaveClass('badge-lg');
  });
});

describe('AlertBanner Component', () => {
  it('renderiza com mensagem', () => {
    render(
      <div role="alert">
        <p>Erro ao processar</p>
      </div>
    );
    expect(screen.getByText('Erro ao processar')).toBeInTheDocument();
  });

  it('renderiza com tipo de alerta', () => {
    const { container } = render(
      <div role="alert" className="alert alert-error">
        <p>Algo deu errado</p>
      </div>
    );
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-error');
  });

  it('renderiza com ícone', () => {
    render(
      <div role="alert">
        <span className="icon">⚠️</span>
        <p>Aviso importante</p>
      </div>
    );
    expect(screen.getByText('Aviso importante')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('renderiza com botão de fechar', () => {
    const handleClose = jest.fn();
    render(
      <div role="alert">
        <p>Mensagem</p>
        <button onClick={handleClose}>×</button>
      </div>
    );

    fireEvent.click(screen.getByText('×'));
    expect(handleClose).toHaveBeenCalled();
  });
});

describe('AnimatedCard Component', () => {
  it('renderiza com conteúdo', () => {
    render(
      <div className="card">
        <h3>Título</h3>
        <p>Descrição</p>
      </div>
    );

    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });

  it('aplica classe de animação', () => {
    const { container } = render(
      <div className="card animate-fade">
        Conteúdo
      </div>
    );

    const card = container.querySelector('.card');
    expect(card).toHaveClass('animate-fade');
  });

  it('renderiza com ação ao hover', () => {
    const handleHover = jest.fn();
    const { container } = render(
      <div
        className="card"
        onMouseEnter={handleHover}
      >
        Card com ação
      </div>
    );

    const card = container.querySelector('.card');
    fireEvent.mouseEnter(card!);

    expect(handleHover).toHaveBeenCalled();
  });

  it('renderiza com imagem', () => {
    render(
      <div className="card">
        <img
          src="/image.jpg"
          alt="Imagem da card"
          data-testid="card-image"
        />
        <p>Descrição</p>
      </div>
    );

    expect(screen.getByTestId('card-image')).toBeInTheDocument();
  });
});

describe('Select Component', () => {
  it('renderiza com opcoes padrão', () => {
    render(
      <select>
        <option value="">Selecione...</option>
        <option value="1">Opção 1</option>
        <option value="2">Opção 2</option>
      </select>
    );

    expect(screen.getByText('Selecione...')).toBeInTheDocument();
    expect(screen.getByText('Opção 1')).toBeInTheDocument();
  });

  it('seleciona valor ao mudar', () => {
    render(
      <select data-testid="select">
        <option value="">Selecione</option>
        <option value="A">Alternativa A</option>
        <option value="B">Alternativa B</option>
      </select>
    );

    const select = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'A' } });

    expect(select).toHaveValue('A');
  });

  it('desabilita quando disabled=true', () => {
    render(
      <select disabled>
        <option>Opção</option>
      </select>
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('chama onChange ao mudar seleção', () => {
    const handleChange = jest.fn();
    render(
      <select onChange={handleChange} data-testid="select">
        <option value="">Selecione</option>
        <option value="X">Opção X</option>
      </select>
    );

    fireEvent.change(screen.getByTestId('select'), { target: { value: 'X' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
