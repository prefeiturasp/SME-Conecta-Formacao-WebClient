/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCodafComum } from './use-codaf-comum';
import { notification } from '~/components/lib/notification';
import { downloadBlob } from '~/core/utils/functions';

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn(), warning: jest.fn() }
}));
jest.mock('~/core/utils/functions', () => ({
  downloadBlob: jest.fn()
}));

const mockNotification = notification as any;
const mockDownloadBlob = downloadBlob as any;

const mockBaixarModelo = jest.fn();
const mockObterAnexo = jest.fn();
jest.mock('~/core/services/codaf-lista-presenca-service', () => ({
  baixarModeloTermoResponsabilidade: (...args) => mockBaixarModelo(...args),
  obterAnexoCodafParaDownload: (...args) => mockObterAnexo(...args),
}));

const renderHookComum = () => renderHook(() => useCodafComum());

const mkAnexo = (code, nome = 'arquivo.pdf') => ({
  arquivoCodigo: code,
  nomeArquivo: nome,
  tipoAnexoId: 1,
  urlDownload: `url/${code}`,
});

describe('useCodafComum', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('mapearAnexosParaFormulario', () => {
    it('DadoArrayVazio_QuandoMapear_EntaoRetornaVazio', () => {
      const { result } = renderHookComum();
      expect(result.current.mapearAnexosParaFormulario([])).toEqual([]);
    });

    it('DadoCodigosInvalidos_QuandoMapear_EntaoFiltraNuloVazioEZero', () => {
      const { result } = renderHookComum();
      const anexos = [
        { arquivoCodigo: null, nomeArquivo: 'a.pdf', tipoAnexoId: 1, urlDownload: '' },
        { arquivoCodigo: '', nomeArquivo: 'b.pdf', tipoAnexoId: 1, urlDownload: '' },
        { arquivoCodigo: '0', nomeArquivo: 'c.pdf', tipoAnexoId: 1, urlDownload: '' },
      ];
      expect(result.current.mapearAnexosParaFormulario(anexos)).toHaveLength(0);
    });

    it('DadoMistoDeValidos_QuandoMapear_EntaoRetornaSomenteValidos', () => {
      const { result } = renderHookComum();
      const saida = result.current.mapearAnexosParaFormulario([
        mkAnexo('abc123', 'doc.pdf'),
        { arquivoCodigo: null, nomeArquivo: 'x.pdf', tipoAnexoId: 1, urlDownload: '' },
        mkAnexo('xyz789', 'img.png'),
      ]);
      expect(saida).toHaveLength(2);
      expect(saida[0]).toMatchObject({ uid: 'abc123', name: 'doc.pdf', status: 'done', xhr: 'abc123', arquivoCodigo: 'abc123' });
      expect(saida[1]).toMatchObject({ uid: 'xyz789', name: 'img.png' });
    });
  });

  describe('onBaixarModelo', () => {
    it('DadoRespostaStatus200_QuandoBaixarModelo_EntaoChamaDownloadEShowSucesso', async () => {
      mockBaixarModelo.mockResolvedValue({ status: 200, data: new Blob(), headers: { 'content-type': 'application/pdf', 'content-disposition': '' } });
      const { result } = renderHookComum();
      await act(async () => { await result.current.onBaixarModelo(); });
      expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      expect(mockNotification.success).toHaveBeenCalledWith(expect.objectContaining({ description: 'Modelo baixado com sucesso!' }));
    });

    it('DadoRespostaNaoOk_QuandoBaixarModelo_EntaoShowErro', async () => {
      mockBaixarModelo.mockResolvedValue({ status: 500, data: null, headers: {} });
      const { result } = renderHookComum();
      await act(async () => { await result.current.onBaixarModelo(); });
      expect(mockDownloadBlob).not.toHaveBeenCalled();
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
    });

    it('DadoExcecaoDeRede_QuandoBaixarModelo_EntaoShowErro', async () => {
      mockBaixarModelo.mockRejectedValue(new Error('network fail'));
      const { result } = renderHookComum();
      await act(async () => { await result.current.onBaixarModelo(); });
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
    });

    it('DadoContentTypeDocx_QuandoBaixarModelo_EntaoNomeArquivoTerminaEmDocx', async () => {
      mockBaixarModelo.mockResolvedValue({ status: 200, data: new Blob(), headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'content-disposition': '' } });
      const { result } = renderHookComum();
      await act(async () => { await result.current.onBaixarModelo(); });
      const [, fileName] = mockDownloadBlob.mock.calls[0];
      expect(fileName).toMatch(/\.docx$/);
    });
  });

  describe('onDownloadAnexo', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    it('DadoArquivoComUrlDownload_QuandoDownloadAnexo_EntaoAbreNovaAba', async () => {
      const arquivo = { urlDownload: 'https://example.com/file.pdf', name: 'file.pdf' };
      const { result } = renderHookComum();
      await act(async () => { await result.current.onDownloadAnexo(arquivo); });
      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com/file.pdf', '_blank');
      expect(mockObterAnexo).not.toHaveBeenCalled();
    });

    it('DadoArquivoSemUrlComXhr_QuandoDownloadAnexo_EntaoChamaApiComXhr', async () => {
      mockObterAnexo.mockResolvedValue({ status: 200, data: new Blob() });
      const arquivo = { urlDownload: undefined, xhr: 'codigo-123', name: 'doc.pdf' };
      const { result } = renderHookComum();
      await act(async () => { await result.current.onDownloadAnexo(arquivo); });
      expect(mockObterAnexo).toHaveBeenCalledWith('codigo-123');
      expect(mockDownloadBlob).toHaveBeenCalledWith(expect.anything(), 'doc.pdf');
    });

    it('DadoArquivoSemNenhumCodigo_QuandoDownloadAnexo_EntaoShowErroCodigoNaoEncontrado', async () => {
      const arquivo = { urlDownload: undefined, xhr: undefined, arquivoCodigo: undefined, response: undefined, name: 'x.pdf' };
      const { result } = renderHookComum();
      await act(async () => { await result.current.onDownloadAnexo(arquivo); });
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Código do arquivo não encontrado' }));
    });

    it('DadoApiRetornaNaoOk_QuandoDownloadAnexo_EntaoShowErro', async () => {
      mockObterAnexo.mockResolvedValue({ status: 500 });
      const arquivo = { urlDownload: undefined, xhr: 'cod', name: 'f.pdf' };
      const { result } = renderHookComum();
      await act(async () => { await result.current.onDownloadAnexo(arquivo); });
      expect(mockNotification.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('exibirErroSalvar', () => {
    it('DadoErros0NoResponse_QuandoExibirErro_EntaoUsaErros', () => {
      const { result } = renderHookComum();
      result.current.exibirErroSalvar({ response: { data: { erros: ['Erro específico'] } } }, false);
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Erro específico' }));
    });

    it('DadoMensagens0NoResponse_QuandoExibirErro_EntaoUsaMensagens', () => {
      const { result } = renderHookComum();
      result.current.exibirErroSalvar({ response: { data: { mensagens: ['Mensagem de erro'] } } }, false);
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Mensagem de erro' }));
    });

    it('DadoErrorMessage_QuandoExibirErro_EntaoUsaMessage', () => {
      const { result } = renderHookComum();
      result.current.exibirErroSalvar(new Error('Falha de rede'), false);
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Falha de rede' }));
    });

    it('DadoModoEdicaoSemDetalhes_QuandoExibirErro_EntaoMensagemPadraoAtualizacao', () => {
      const { result } = renderHookComum();
      result.current.exibirErroSalvar({}, true);
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Erro ao atualizar o registro' }));
    });

    it('DadoModoNovoSemDetalhes_QuandoExibirErro_EntaoMensagemPadraoSalvar', () => {
      const { result } = renderHookComum();
      result.current.exibirErroSalvar({}, false);
      expect(mockNotification.error).toHaveBeenCalledWith(expect.objectContaining({ description: 'Erro ao salvar o registro' }));
    });
  });

  it('DadoEstadoInicial_QuandoRenderizar_EntaoLoadingComumFalso', () => {
    const { result } = renderHookComum();
    expect(result.current.loadingComum).toBe(false);
  });
});
