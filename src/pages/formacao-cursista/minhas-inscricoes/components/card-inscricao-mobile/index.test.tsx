/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CardInscricaoMobile, { getStatusConfig } from './index';
import { InscricaoProps } from '../../listagem';

describe('CardInscricaoMobile', () => {
  const mockRecord: InscricaoProps = {
    id: 1,
    codigoFormacao: 1001,
    nomeFormacao: 'Formação em Tecnologia Educacional',
    nomeTurma: 'Turma Alpha',
    datas: '01/05/2026 a 30/05/2026',
    cargoFuncaoCodigo: '10',
    cargoFuncao: 'Professor',
    situacao: 'Confirmada',
    podeCancelar: true,
    integrarNoSga: false,
    iniciado: false,
  };

  const defaultProps = {
    record: mockRecord,
    onExibirDetalhes: jest.fn(),
    onCancelarInscricao: jest.fn(),
    mostrarCancelar: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar dados básicos do card corretamente', () => {
    render(<CardInscricaoMobile {...defaultProps} />);

    expect(screen.getByText('Cód. 1001')).toBeInTheDocument();
    expect(screen.getByText('Formação em Tecnologia Educacional')).toBeInTheDocument();
    expect(screen.getByText('01/05/2026 a 30/05/2026')).toBeInTheDocument();
    expect(screen.getByText('Turma Alpha')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
  });

  it('deve chamar onExibirDetalhes ao clicar no botão de detalhes', () => {
    render(<CardInscricaoMobile {...defaultProps} />);

    const btnDetalhes = screen.getByTestId('btn-detalhes-1');
    fireEvent.click(btnDetalhes);

    expect(defaultProps.onExibirDetalhes).toHaveBeenCalledWith(mockRecord);
  });

  it('deve chamar onCancelarInscricao ao clicar em cancelar quando podeCancelar for true', () => {
    render(<CardInscricaoMobile {...defaultProps} />);

    const btnCancelar = screen.getByTestId('btn-cancelar-1');
    expect(btnCancelar).not.toBeDisabled();
    fireEvent.click(btnCancelar);

    expect(defaultProps.onCancelarInscricao).toHaveBeenCalledWith(mockRecord);
  });

  it('deve desabilitar o botão cancelar e não chamar ação quando podeCancelar for false', () => {
    const recordDisabled = { ...mockRecord, podeCancelar: false };
    render(<CardInscricaoMobile {...defaultProps} record={recordDisabled} />);

    const btnCancelar = screen.getByTestId('btn-cancelar-1');
    expect(btnCancelar).toBeDisabled();
    fireEvent.click(btnCancelar);

    expect(defaultProps.onCancelarInscricao).not.toHaveBeenCalled();
  });

  it('não deve renderizar o botão cancelar quando mostrarCancelar for false', () => {
    render(<CardInscricaoMobile {...defaultProps} mostrarCancelar={false} />);

    expect(screen.queryByTestId('btn-cancelar-1')).not.toBeInTheDocument();
  });

  it('não deve renderizar o botão cancelar quando onCancelarInscricao não for fornecido', () => {
    render(<CardInscricaoMobile record={mockRecord} onExibirDetalhes={jest.fn()} />);

    expect(screen.queryByTestId('btn-cancelar-1')).not.toBeInTheDocument();
  });

  it('não deve quebrar quando datas ou nomeTurma não forem informados', () => {
    const recordSemDatasETurma = {
      ...mockRecord,
      datas: '',
      nomeTurma: '',
    };
    render(<CardInscricaoMobile {...defaultProps} record={recordSemDatasETurma} />);

    expect(screen.queryByText('Turma Alpha')).not.toBeInTheDocument();
    expect(screen.getByText('Cód. 1001')).toBeInTheDocument();
  });

  describe('getStatusConfig', () => {
    it('deve mapear status Confirmada', () => {
      const config = getStatusConfig('Confirmada');
      expect(config.label).toBe('Confirmada');
      expect(config.color).toBe('#039D03');
    });

    it('deve mapear status Enviada', () => {
      const config = getStatusConfig('Enviada');
      expect(config.label).toBe('Enviada');
      expect(config.color).toBe('#0D99D5');
    });

    it('deve mapear status Aguardando a análise', () => {
      const config = getStatusConfig('Aguardando a análise');
      expect(config.label).toBe('Aguardando análise');
      expect(config.color).toBe('#797979');
    });

    it('deve mapear status Em espera', () => {
      const config = getStatusConfig('Em espera');
      expect(config.label).toBe('Em espera');
      expect(config.color).toBe('#785C00');
    });

    it('deve mapear status Cancelada', () => {
      const config = getStatusConfig('Cancelada');
      expect(config.label).toBe('Cancelada');
      expect(config.color).toBe('#B40C02');
    });

    it('deve mapear status Transferida', () => {
      const config = getStatusConfig('Transferida');
      expect(config.label).toBe('Transferida');
      expect(config.color).toBe('#277E77');
    });

    it('deve usar fallback para status desconhecido ou vazio', () => {
      const configDesconhecido = getStatusConfig('Processando');
      expect(configDesconhecido.label).toBe('Processando');

      const configVazio = getStatusConfig('');
      expect(configVazio.label).toBe('Pendente');
    });
  });
});
