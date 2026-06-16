/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import CardInformacoesCadastrante from './index';

import {
  obterDadosCadastrante,
  obterRoteiroPropostaFormativa,
} from '../../../../core/services/proposta-service';

import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterDadosCadastrante: jest.fn(),
  obterRoteiroPropostaFormativa: jest.fn(),
}));

const mockDados = {
  usuarioLogadoNome: 'João da Silva',
  usuarioLogadoEmail: 'joao@teste.com',
  areaPromotora: 'SME',
  areaPromotoraTipo: 'Diretoria',
  areaPromotoraTipoId: 3,
  areaPromotoraTelefones: '(11)99999-9999',
  areaPromotoraEmails: 'sme@teste.com',
};

const mockRoteiro = {
  descricao: '<p>Texto do roteiro</p>',
};

describe('CardInformacoesCadastrante', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({
      id: '10',
    });

    (obterDadosCadastrante as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockDados,
    });

    (obterRoteiroPropostaFormativa as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockRoteiro,
    });
  });

  it('deve renderizar os dados do cadastrante', async () => {
    render(<CardInformacoesCadastrante />);

    expect(await screen.findByText('João da Silva')).toBeInTheDocument();

    expect(screen.getByText(/E-mail:/)).toBeInTheDocument();
    expect(screen.getByText(/Área promotora:/)).toBeInTheDocument();
    expect(screen.getByText(/Tipo de instituição:/)).toBeInTheDocument();
    expect(screen.getByText(/Telefone:/)).toBeInTheDocument();
  });

  it('deve chamar obterDados passando id', async () => {
    render(<CardInformacoesCadastrante />);

    await waitFor(() => {
      expect(obterDadosCadastrante).toHaveBeenCalledWith(10);
    });
  });

  it('deve chamar obterDados sem id quando params estiver vazio', async () => {
    (useParams as jest.Mock).mockReturnValue({});

    render(<CardInformacoesCadastrante />);

    await waitFor(() => {
      expect(obterDadosCadastrante).toHaveBeenCalledWith(undefined);
    });
  });

  it('deve chamar setTipoInstituicao', async () => {
    const fn = jest.fn();

    render(<CardInformacoesCadastrante setTipoInstituicao={fn} />);

    await waitFor(() => {
      expect(fn).toHaveBeenCalledWith(3);
    });
  });

  it('não deve chamar setTipoInstituicao quando não informado', async () => {
    render(<CardInformacoesCadastrante />);

    await waitFor(() => {
      expect(obterDadosCadastrante).toHaveBeenCalled();
    });
  });

  it('não deve atualizar dados quando resposta não possuir sucesso', async () => {
    (obterDadosCadastrante as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    render(<CardInformacoesCadastrante />);

    await waitFor(() => {
      expect(screen.queryByText('João da Silva')).not.toBeInTheDocument();
    });
  });

  it('deve abrir modal carregando roteiro', async () => {
    render(<CardInformacoesCadastrante />);

    fireEvent.click(
      await screen.findByRole('button', {
        name: /Confira o roteiro/i,
      })
    );

    expect(await screen.findByText('Roteiro para elaboração das propostas formativas')).toBeInTheDocument();

    expect(screen.getByText('Texto do roteiro')).toBeInTheDocument();

    expect(obterRoteiroPropostaFormativa).toHaveBeenCalledTimes(1);
  });

  it('deve fechar modal', async () => {
    render(<CardInformacoesCadastrante />);

    fireEvent.click(
      await screen.findByRole('button', {
        name: /Confira o roteiro/i,
      })
    );

    expect(await screen.findByText(/Roteiro para elaboração/)).toBeInTheDocument();

    fireEvent.click(document.querySelector('.ant-modal-close')!);

    await waitFor(() => {
      expect(
        screen.queryByText(/Roteiro para elaboração/)
      ).not.toBeInTheDocument();
    });
  });

  it('não deve preencher roteiro quando serviço retornar sucesso false', async () => {
    (obterRoteiroPropostaFormativa as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    render(<CardInformacoesCadastrante />);

    fireEvent.click(
      await screen.findByRole('button', {
        name: /Confira o roteiro/i,
      })
    );

    expect(await screen.findByText(/Roteiro para elaboração/)).toBeInTheDocument();

    expect(
      document.querySelector('.ant-typography')?.innerHTML
    ).toBe('');
  });

  it('não deve buscar roteiro novamente quando já carregado', async () => {
    render(<CardInformacoesCadastrante />);

    fireEvent.click(
      await screen.findByRole('button', {
        name: /Confira o roteiro/i,
      })
    );

    await screen.findByText('Texto do roteiro');

    fireEvent.click(document.querySelector('.ant-modal-close')!);

    await waitFor(() => {
      expect(
        screen.queryByText(/Roteiro para elaboração/)
      ).not.toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /Confira o roteiro/i,
      })
    );

    await screen.findByText('Texto do roteiro');

    expect(obterRoteiroPropostaFormativa).toHaveBeenCalledTimes(1);
  });

  it('deve manter loading durante chamadas', async () => {
    let resolver: any;

    (obterDadosCadastrante as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        })
    );

    render(<CardInformacoesCadastrante />);

    expect(document.querySelector('.ant-card-loading')).toBeInTheDocument();

    resolver({
      sucesso: true,
      dados: mockDados,
    });

    await screen.findByText('João da Silva');
  });
});