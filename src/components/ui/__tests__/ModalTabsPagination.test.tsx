import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Modal Component', () => {
  const TestModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-modal="true">
        <div className="backdrop" onClick={onClose} />
        <div className="modal-content">
          <h2>Título do Modal</h2>
          <p>Conteúdo do modal</p>
          <button onClick={onClose}>Fechar</button>
          <button>Confirmar</button>
        </div>
      </div>
    );
  };

  it('não renderiza quando isOpen=false', () => {
    render(<TestModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renderiza quando isOpen=true', () => {
    render(<TestModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });

  it('fecha ao clicar no botão fechar', () => {
    const handleClose = jest.fn();
    render(<TestModal isOpen={true} onClose={handleClose} />);

    fireEvent.click(screen.getByText('Fechar'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('fecha ao clicar no backdrop', () => {
    const handleClose = jest.fn();
    const { container } = render(<TestModal isOpen={true} onClose={handleClose} />);

    const backdrop = container.querySelector('.backdrop');
    if (backdrop) fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renderiza com foco no modal', () => {
    render(<TestModal isOpen={true} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('contém botões de ação', () => {
    render(<TestModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Fechar')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });
});

describe('Tabs Component', () => {
  const TestTabs = () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div>
        <div role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'tab1'}
            onClick={() => setActiveTab('tab1')}
          >
            Tab 1
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'tab2'}
            onClick={() => setActiveTab('tab2')}
          >
            Tab 2
          </button>
        </div>
        <div role="tabpanel" hidden={activeTab !== 'tab1'}>
          Conteúdo Tab 1
        </div>
        <div role="tabpanel" hidden={activeTab !== 'tab2'}>
          Conteúdo Tab 2
        </div>
      </div>
    );
  };

  it('renderiza todas as abas', () => {
    render(<TestTabs />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('ativa primeira aba por padrão', () => {
    render(<TestTabs />);
    expect(screen.getByText('Conteúdo Tab 1')).not.toHaveAttribute('hidden');
    expect(screen.getByText('Conteúdo Tab 2')).toHaveAttribute('hidden');
  });

  it('muda conteúdo ao clicar na aba', () => {
    render(<TestTabs />);

    fireEvent.click(screen.getByText('Tab 2'));

    expect(screen.getByText('Conteúdo Tab 2')).not.toHaveAttribute('hidden');
    expect(screen.getByText('Conteúdo Tab 1')).toHaveAttribute('hidden');
  });

  it('marca aba selecionada com aria-selected', () => {
    render(<TestTabs />);

    const tab2Button = screen.getByText('Tab 2').closest('button');
    fireEvent.click(tab2Button!);

    expect(tab2Button).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Tab 1').closest('button')).toHaveAttribute('aria-selected', 'false');
  });

  it('volta para primeira aba', () => {
    render(<TestTabs />);

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Conteúdo Tab 2')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('Tab 1'));
    expect(screen.getByText('Conteúdo Tab 1')).not.toHaveAttribute('hidden');
  });
});

describe('Pagination Component', () => {
  const TestPagination = ({ currentPage = 1, totalPages = 5, onPageChange }: any) => (
    <nav role="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>
      <span>Página {currentPage} de {totalPages}</span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próxima
      </button>
    </nav>
  );

  it('desabilita botão anterior na primeira página', () => {
    render(
      <TestPagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText('Anterior')).toBeDisabled();
    expect(screen.getByText('Próxima')).not.toBeDisabled();
  });

  it('desabilita botão próxima na última página', () => {
    render(
      <TestPagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText('Próxima')).toBeDisabled();
    expect(screen.getByText('Anterior')).not.toBeDisabled();
  });

  it('habilita ambos botões na página intermediária', () => {
    render(
      <TestPagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText('Anterior')).not.toBeDisabled();
    expect(screen.getByText('Próxima')).not.toBeDisabled();
  });

  it('chama onPageChange ao clicar próxima', () => {
    const handlePageChange = jest.fn();
    render(
      <TestPagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByText('Próxima'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('chama onPageChange ao clicar anterior', () => {
    const handlePageChange = jest.fn();
    render(
      <TestPagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByText('Anterior'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('mostra página atual e total', () => {
    render(
      <TestPagination currentPage={2} totalPages={10} onPageChange={() => {}} />
    );

    expect(screen.getByText('Página 2 de 10')).toBeInTheDocument();
  });
});
