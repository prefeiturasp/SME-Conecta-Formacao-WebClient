/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExclusaoCodaf } from './use-exclusao-codaf';
import { notification } from '~/components/lib/notification';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn(), warning: jest.fn() }
}));

const mockNotification = notification as any;

const ROTA_SUCESSO = '/rota-sucesso';
const renderHookExclusao = (deletarApiFn = jest.fn()) =>
  renderHook(() => useExclusaoCodaf(deletarApiFn, ROTA_SUCESSO));

describe('useExclusaoCodaf', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Estado inicial', () => {
    it('DadoHookRecemCriado_QuandoVerificarEstado_EntaoModalFechadoELoadingFalso', () => {
      const { result } = renderHookExclusao();
      expect(result.current.modalExcluirVisible).toBe(false);
      expect(result.current.loadingExclusao).toBe(false);
    });
  });

  describe('onClickExcluir', () => {
    it('DadoClicouExcluir_QuandoChamar_EntaoAbreModal', () => {
      const { result } = renderHookExclusao();
      act(() => { result.current.onClickExcluir(); });
      expect(result.current.modalExcluirVisible).toBe(true);
    });
  });

  describe('cancelarExclusao', () => {
    it('DadoModalAberto_QuandoCancelar_EntaoFechaModal', () => {
      const { result } = renderHookExclusao();
      act(() => { result.current.onClickExcluir(); });
      act(() => { result.current.cancelarExclusao(); });
      expect(result.current.modalExcluirVisible).toBe(false);
    });
  });

  describe('confirmarExclusao', () => {
    it('DadoRegistroIdNulo_QuandoConfirmar_EntaoShowWarningESemChamadaApi', async () => {
      const mockDeleteApi = jest.fn();
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(null); });
      expect(mockDeleteApi).not.toHaveBeenCalled();
      expect(mockNotification.warning).toHaveBeenCalledWith(expect.objectContaining({ description: 'Registro não encontrado' }));
      expect(result.current.modalExcluirVisible).toBe(false);
    });

    it('DadoStatus204_QuandoConfirmar_EntaoNavigateEShowSucesso', async () => {
      const mockDeleteApi = jest.fn().mockResolvedValue({ status: 204 });
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(mockDeleteApi).toHaveBeenCalledWith(42);
      expect(mockNotification.success).toHaveBeenCalledWith(expect.objectContaining({ description: 'Registro excluído com sucesso!' }));
      expect(mockNavigate).toHaveBeenCalledWith(ROTA_SUCESSO);
    });

    it('DadoStatusNao204ComMensagens_QuandoConfirmar_EntaoShowErroDeMensagens', async () => {
      const mockDeleteApi = jest.fn().mockResolvedValue({ status: 400, mensagens: ['Registro em uso'] });
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Registro em uso' }));
    });

    it('DadoStatusNao204SemMensagens_QuandoConfirmar_EntaoShowErroPadrao', async () => {
      const mockDeleteApi = jest.fn().mockResolvedValue({ status: 500, mensagens: [] });
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Erro ao excluir o registro' }));
    });

    it('DadoExcecaoComErros_QuandoConfirmar_EntaoShowErroDetalhadoDaExcecao', async () => {
      const mockDeleteApi = jest.fn().mockRejectedValue({ response: { data: { erros: ['Falha crítica'] } } });
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Falha crítica' }));
    });

    it('DadoExcecaoComMessage_QuandoConfirmar_EntaoShowMensagemDaExcecao', async () => {
      const mockDeleteApi = jest.fn().mockRejectedValue(new Error('Timeout'));
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Timeout' }));
    });

    it('DadoConfirmacao_QuandoConcluir_EntaoLoadingVoltaParaFalso', async () => {
      const mockDeleteApi = jest.fn().mockResolvedValue({ status: 204 });
      const { result } = renderHookExclusao(mockDeleteApi);
      await act(async () => { await result.current.confirmarExclusao(42); });
      expect(result.current.loadingExclusao).toBe(false);
    });
  });
});
