/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { obterDadosFormacao } from '../../../../core/services/area-publica-service';
import { RetornoDetalheFormacaoDto } from '../../../../core/dto/dados-formacao-area-publica-dto';
import VisualizarFormacao from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

jest.mock('~/core/services/area-publica-service', () => ({
  obterDadosFormacao: jest.fn(),
}));

jest.mock('../../components/card-turmas', () => ({
  __esModule: true,
  default: ({ turma }: any) => <div data-testid="card-turma">{turma.nome}</div>,
}));

jest.mock('../list/components/dados-destaque', () => ({
  __esModule: true,
  default: () => <div data-testid="dados-destaque">DadosDestaque</div>,
}));

const dadosFormacaoMock: RetornoDetalheFormacaoDto = {
  titulo: 'Curso teste',
  sobreEsteCurso: '<p>Descrição do curso</p>',
  publicosAlvo: ['Professor', 'Coordenador'],
  palavrasChaves: ['Palavra1', 'Palavra2'],
  inscricaoEncerrada: false,
  turmas: [
    { nome: 'Turma A', periodos: [], local: '', horario: '', inscricaoEncerrada: false },
    { nome: 'Turma B', periodos: [], local: '', horario: '', inscricaoEncerrada: false },
  ],
};

describe('VisualizarFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar e exibir os dados da formação, incluindo o texto de "Sobre este curso"', async () => {
    (obterDadosFormacao as jest.Mock).mockResolvedValue({ sucesso: true, dados: dadosFormacaoMock });

    render(<VisualizarFormacao />);

    expect(await screen.findByText('Sobre este curso')).toBeInTheDocument();
    expect(await screen.findByText('Descrição do curso')).toBeInTheDocument();
    expect(obterDadosFormacao).toHaveBeenCalledWith(1);
  });

  it('deve exibir a lista de público alvo quando informada', async () => {
    (obterDadosFormacao as jest.Mock).mockResolvedValue({ sucesso: true, dados: dadosFormacaoMock });

    render(<VisualizarFormacao />);

    expect(await screen.findByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('Coordenador')).toBeInTheDocument();
  });

  it('não deve exibir a coluna de público alvo quando a lista estiver vazia', async () => {
    (obterDadosFormacao as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: { ...dadosFormacaoMock, publicosAlvo: [] },
    });

    render(<VisualizarFormacao />);

    await screen.findByText('Sobre este curso');
    expect(screen.queryByText('Professor')).not.toBeInTheDocument();
  });

  it('deve exibir as turmas retornadas', async () => {
    (obterDadosFormacao as jest.Mock).mockResolvedValue({ sucesso: true, dados: dadosFormacaoMock });

    render(<VisualizarFormacao />);

    expect(await screen.findByText('Turma A')).toBeInTheDocument();
    expect(screen.getByText('Turma B')).toBeInTheDocument();
  });

  it('não deve atualizar os dados quando a requisição não tiver sucesso', async () => {
    (obterDadosFormacao as jest.Mock).mockResolvedValue({ sucesso: false, dados: undefined });

    render(<VisualizarFormacao />);

    expect(await screen.findByTestId('dados-destaque')).toBeInTheDocument();
    expect(screen.queryByText('Descrição do curso')).not.toBeInTheDocument();
  });
});
