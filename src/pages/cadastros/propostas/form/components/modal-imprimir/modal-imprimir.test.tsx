/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalImprimir } from './modal-imprimir';
import { notification } from '~/components/lib/notification';
import { obterRelatorioLaudaPublicacao } from '~/core/services/proposta-service';
import { obterRelatorioLaudaCompletaDocx } from '~/core/services/relatorio-service';

// Mock dependencies
jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn(),
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

jest.mock('~/components/main/input/imprimir-lauda', () => ({
  RadioRelatorioLauda: () => <div data-testid="radio-relatorio-lauda" />,
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterRelatorioLaudaPublicacao: jest.fn(),
}));

jest.mock('~/core/services/relatorio-service', () => ({
  obterRelatorioLaudaCompletaDocx: jest.fn(),
}));

// Mock window.URL methods
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'URL', {
    value: {
      createObjectURL: jest.fn(),
      revokeObjectURL: jest.fn(),
    },
  });
}

// Mock fetch
global.fetch = jest.fn();

describe('ModalImprimir', () => {
  const onFecharButtonMock = jest.fn();
  const mockPropostaId = 123;
  let useWatchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useWatchMock = require('antd/es/form/Form').useWatch as jest.Mock;
  });

  const renderComponent = () =>
    render(
      <ModalImprimir propostaId={mockPropostaId} onFecharButton={onFecharButtonMock} />
    );

  it('deve renderizar corretamente o modal e o RadioRelatorioLauda', () => {
    renderComponent();
    expect(screen.getByText('Impressão de relatório')).toBeInTheDocument();
    expect(screen.getByTestId('radio-relatorio-lauda')).toBeInTheDocument();
  });

  it('deve chamar onFecharButton ao clicar no botão Cancelar', () => {
    renderComponent();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(onFecharButtonMock).toHaveBeenCalledTimes(1);
  });

  it('deve chamar obterRelatorioLaudaCompletaDocx quando relatorioLaudaWatch for false e baixar o docx', async () => {
    useWatchMock.mockReturnValue(false);

    const mockBlob = new Blob(['dummy content']);
    const mockObterCompleta = obterRelatorioLaudaCompletaDocx as jest.Mock;
    mockObterCompleta.mockResolvedValue({
      sucesso: true,
      dados: mockBlob,
    });

    const mockCreateObjectURL = window.URL.createObjectURL as jest.Mock;
    mockCreateObjectURL.mockReturnValue('blob:test-url');

    renderComponent();
    
    const gerarButton = screen.getByRole('button', { name: /gerar/i });
    fireEvent.click(gerarButton);

    await waitFor(() => {
      expect(mockObterCompleta).toHaveBeenCalledWith(mockPropostaId);
    });

    expect(notification.success).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Sucesso' })
    );

    // As functions are called, check createObjectURL
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    expect(onFecharButtonMock).toHaveBeenCalled();
  });

  it('deve chamar obterRelatorioLaudaPublicacao quando relatorioLaudaWatch for true e fazer fetch da url', async () => {
    useWatchMock.mockReturnValue(true);

    const mockUrl = 'http://test.url/relatorio.doc';
    const mockObterPublicacao = obterRelatorioLaudaPublicacao as jest.Mock;
    mockObterPublicacao.mockResolvedValue({
      sucesso: true,
      dados: mockUrl,
    });

    const mockFetch = global.fetch as jest.Mock;
    const mockBlobResponse = new Blob(['dummy']);
    mockFetch.mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlobResponse),
    });

    const mockCreateObjectURL = window.URL.createObjectURL as jest.Mock;
    mockCreateObjectURL.mockReturnValue('blob:test-url-2');

    renderComponent();
    
    const gerarButton = screen.getByRole('button', { name: /gerar/i });
    fireEvent.click(gerarButton);

    await waitFor(() => {
      expect(mockObterPublicacao).toHaveBeenCalledWith(mockPropostaId);
    });

    expect(notification.success).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Sucesso' })
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    });

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlobResponse);
    });

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url-2');
    expect(onFecharButtonMock).toHaveBeenCalled();
  });

  it('não deve fazer download se o blob for nulo após o fetch (publicação)', async () => {
    useWatchMock.mockReturnValue(true);

    const mockUrl = 'http://test.url/relatorio.doc';
    const mockObterPublicacao = obterRelatorioLaudaPublicacao as jest.Mock;
    mockObterPublicacao.mockResolvedValue({
      sucesso: true,
      dados: mockUrl,
    });

    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(null),
    });

    const mockCreateObjectURL = window.URL.createObjectURL as jest.Mock;
    mockCreateObjectURL.mockClear();

    renderComponent();
    
    const gerarButton = screen.getByRole('button', { name: /gerar/i });
    fireEvent.click(gerarButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    });

    await waitFor(() => {
      // Como o blob veio null, ele aborta
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });
  });

  it('não deve fazer download se a resposta do fetch falhar (!ok)', async () => {
    useWatchMock.mockReturnValue(true);

    const mockUrl = 'http://test.url/relatorio.doc';
    const mockObterPublicacao = obterRelatorioLaudaPublicacao as jest.Mock;
    mockObterPublicacao.mockResolvedValue({
      sucesso: true,
      dados: mockUrl,
    });

    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({
      ok: false, // simula erro 404/500
    });

    const mockCreateObjectURL = window.URL.createObjectURL as jest.Mock;
    mockCreateObjectURL.mockClear();

    renderComponent();
    
    const gerarButton = screen.getByRole('button', { name: /gerar/i });
    fireEvent.click(gerarButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    });

    await waitFor(() => {
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });
  });

  it('não deve notificar nem fechar se a api retornar erro (sucesso: false)', async () => {
    useWatchMock.mockReturnValue(false);

    const mockObterCompleta = obterRelatorioLaudaCompletaDocx as jest.Mock;
    mockObterCompleta.mockResolvedValue({
      sucesso: false,
    });

    renderComponent();
    
    const gerarButton = screen.getByRole('button', { name: /gerar/i });
    fireEvent.click(gerarButton);

    await waitFor(() => {
      expect(mockObterCompleta).toHaveBeenCalledWith(mockPropostaId);
    });

    expect(notification.success).not.toHaveBeenCalled();
    expect(onFecharButtonMock).not.toHaveBeenCalled();
  });
});
