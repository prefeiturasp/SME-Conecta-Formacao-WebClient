/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useInscricaoFormacao } from './use-inscricao-formacao';
import { RetornoDetalheFormacaoDto } from '~/core/dto/dados-formacao-area-publica-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
let mockState: any;

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) => selector(mockState),
}));

jest.mock('~/core/redux/modules/area-publica-inscricao/actions', () => ({
  setDadosFormacao: (dados: any) => ({ type: 'SET_DADOS_FORMACAO', payload: dados }),
}));

jest.mock('~/core/services/autenticacao-service', () => ({
  __esModule: true,
  default: { alterarPerfilSelecionado: jest.fn() },
}));

jest.mock('~/core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

jest.mock('~/core/enum/tipo-perfil', () => ({
  TipoPerfilEnum: { Cursista: 'Cursista' },
  TipoPerfilTagDisplay: { Cursista: 'Cursista' },
}));

const dadosFormacao: RetornoDetalheFormacaoDto = {
  titulo: 'Formação teste',
  inscricaoEncerrada: false,
  turmas: [],
};

describe('useInscricaoFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      auth: { autenticado: true },
      perfil: { perfilUsuario: [{ perfil: 'perfil-cursista', perfilNome: 'Cursista' }] },
    };
    (autenticacaoService.alterarPerfilSelecionado as jest.Mock).mockResolvedValue({
      data: { token: 'x' },
    });
  });

  it('deve trocar o perfil para cursista e navegar para a inscrição quando autenticado', async () => {
    const { result } = renderHook(() => useInscricaoFormacao(dadosFormacao, 10));

    result.current.enviarInscricao();
    await Promise.resolve();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_DADOS_FORMACAO',
      payload: dadosFormacao,
    });
    expect(autenticacaoService.alterarPerfilSelecionado).toHaveBeenCalledWith('perfil-cursista');
    expect(validarAutenticacao).toHaveBeenCalledWith({ token: 'x' });
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.INSCRICAO}/10`, { replace: true });
  });

  it('deve navegar para o login quando não autenticado', () => {
    mockState.auth.autenticado = false;
    const { result } = renderHook(() => useInscricaoFormacao(dadosFormacao, 10));

    result.current.enviarInscricao();

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, { replace: true });
    expect(autenticacaoService.alterarPerfilSelecionado).not.toHaveBeenCalled();
  });

  it('não deve fazer nada quando não houver dados da formação', () => {
    const { result } = renderHook(() => useInscricaoFormacao(undefined, 10));

    result.current.enviarInscricao();

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.inscricaoDesabilitada).toBe(true);
  });

  it('deve desabilitar a inscrição quando estiver encerrada', () => {
    const { result } = renderHook(() =>
      useInscricaoFormacao({ ...dadosFormacao, inscricaoEncerrada: true }, 10),
    );

    expect(result.current.inscricaoDesabilitada).toBe(true);
  });

  it('deve retornar o link de inscrição externa', () => {
    const { result } = renderHook(() =>
      useInscricaoFormacao({ ...dadosFormacao, linkParaInscricoesExterna: 'https://externo' }, 10),
    );

    expect(result.current.linkInscricaoExterna).toBe('https://externo');
    expect(result.current.inscricaoDesabilitada).toBe(false);
  });
});
