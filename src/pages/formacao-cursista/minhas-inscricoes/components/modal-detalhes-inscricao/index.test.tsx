/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalDetalhesInscricao from './index';
import { InscricaoProps } from '../../listagem';

jest.mock('../modal-edit-cargo-funcao/modal-edit-cargo-funcao-button', () => {
  return function MockModalEditCargoFuncaoButton() {
    return <button data-testid='mock-edit-cargo-btn'>Editar Cargo</button>;
  };
});

describe('ModalDetalhesInscricao', () => {
  const mockRecord: InscricaoProps & { origem?: string; dataInscricao?: string } = {
    id: 10,
    codigoFormacao: 5432,
    nomeFormacao: 'Especialização em Robótica Pedagógica',
    nomeTurma: 'Turma Beta',
    datas: '10/06/2026 a 20/07/2026',
    dataInscricao: '05/05/2026',
    cargoFuncaoCodigo: '15',
    cargoFuncao: 'Coordenador Pedagógico',
    situacao: 'Confirmada',
    origem: 'SGP',
    podeCancelar: true,
    integrarNoSga: false,
    iniciado: false,
  };

  const defaultProps = {
    open: true,
    record: mockRecord,
    onClose: jest.fn(),
    onCancelar: jest.fn(),
    mostrarCancelar: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar nada quando open for false ou record for null', () => {
    const { container: c1 } = render(<ModalDetalhesInscricao {...defaultProps} open={false} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<ModalDetalhesInscricao {...defaultProps} record={null} />);
    expect(c2.firstChild).toBeNull();
  });

  it('deve renderizar os detalhes completos da inscrição', () => {
    render(<ModalDetalhesInscricao {...defaultProps} />);

    expect(screen.getByText('Detalhes da inscrição')).toBeInTheDocument();
    expect(screen.getByText('Especialização em Robótica Pedagógica')).toBeInTheDocument();
    expect(screen.getByText('5432')).toBeInTheDocument();
    expect(screen.getByText('05/05/2026')).toBeInTheDocument();
    expect(screen.getByText('Turma Beta')).toBeInTheDocument();
    expect(screen.getByText('10/06/2026 a 20/07/2026')).toBeInTheDocument();
    expect(screen.getByText('Coordenador Pedagógico')).toBeInTheDocument();
    expect(screen.getByText('SGP')).toBeInTheDocument();
    expect(screen.getByTestId('mock-edit-cargo-btn')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão fechar X', () => {
    render(<ModalDetalhesInscricao {...defaultProps} />);

    fireEvent.click(screen.getByTestId('btn-fechar-detalhes'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay', () => {
    render(<ModalDetalhesInscricao {...defaultProps} />);

    fireEvent.click(screen.getByTestId('modal-detalhes-overlay'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no botão Voltar', () => {
    render(<ModalDetalhesInscricao {...defaultProps} />);

    fireEvent.click(screen.getByTestId('btn-voltar-detalhes'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancelar ao clicar no botão Cancelar inscrição', () => {
    render(<ModalDetalhesInscricao {...defaultProps} />);

    const btnCancelar = screen.getByTestId('btn-cancelar-modal-detalhes');
    fireEvent.click(btnCancelar);

    expect(defaultProps.onCancelar).toHaveBeenCalledWith(mockRecord);
  });

  it('não deve exibir o botão cancelar se podeCancelar for false', () => {
    const recordSemCancelar = { ...mockRecord, podeCancelar: false };
    render(<ModalDetalhesInscricao {...defaultProps} record={recordSemCancelar} />);

    expect(screen.queryByTestId('btn-cancelar-modal-detalhes')).not.toBeInTheDocument();
  });

  it('não deve exibir o botão cancelar se mostrarCancelar for false ou onCancelar for undefined', () => {
    const { rerender } = render(
      <ModalDetalhesInscricao {...defaultProps} mostrarCancelar={false} />,
    );
    expect(screen.queryByTestId('btn-cancelar-modal-detalhes')).not.toBeInTheDocument();

    rerender(<ModalDetalhesInscricao open={true} record={mockRecord} onClose={jest.fn()} />);
    expect(screen.queryByTestId('btn-cancelar-modal-detalhes')).not.toBeInTheDocument();
  });

  it('deve renderizar campos padrão (-) quando dados opcionais não forem fornecidos', () => {
    const recordVazio = {
      id: 20,
      codigoFormacao: 0,
      nomeFormacao: 'Formação Sem Dados',
      nomeTurma: '',
      datas: '',
      cargoFuncaoCodigo: '',
      cargoFuncao: '',
      situacao: 'Aguardando análise',
      podeCancelar: false,
      integrarNoSga: false,
      iniciado: false,
    };

    render(<ModalDetalhesInscricao {...defaultProps} record={recordVazio} />);

    expect(screen.queryByText('SGP')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-edit-cargo-btn')).not.toBeInTheDocument();
  });

  it('deve renderizar a badge de situação de aprovação na aba finalizadas', () => {
    render(
      <ModalDetalhesInscricao
        {...defaultProps}
        aba='finalizadas'
        record={{ ...mockRecord, situacaoAprovacao: 1 }}
      />,
    );

    expect(screen.getByTestId('modal-detalhes-status')).toHaveTextContent('Confirmada');
    expect(screen.getByTestId('modal-detalhes-status-aprovacao')).toHaveTextContent('Aprovado');
  });
});
