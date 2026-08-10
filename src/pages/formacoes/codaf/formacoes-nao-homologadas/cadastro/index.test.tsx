import { describe, test, expect } from '@jest/globals';

describe('CadastroCodafFormacoesNaoHomologadas - Regras de Negócio e Máquina de Estados', () => {
  describe('Filtragem de anexos exibidos', () => {
    const mapearAnexosParaFormulario = (anexos: any[] = []) =>
      anexos
        .filter(
          (anexo) =>
            anexo?.arquivoCodigo != null &&
            anexo?.arquivoCodigo !== '' &&
            anexo?.arquivoCodigo !== '0'
        )
        .map((anexo) => ({
          uid: anexo.arquivoCodigo,
          name: anexo.nomeArquivo,
          status: 'done',
          xhr: anexo.arquivoCodigo,
          arquivoCodigo: anexo.arquivoCodigo,
          nomeArquivo: anexo.nomeArquivo,
          tipoAnexoId: anexo.tipoAnexoId,
          urlDownload: anexo.urlDownload,
        }));

    test('deve manter apenas anexos com arquivoCodigo válido e mapear para formulario', () => {
      const anexos = [
        { arquivoCodigo: '123', nomeArquivo: 'teste.pdf', tipoAnexoId: 1, urlDownload: 'url1' },
        { arquivoCodigo: null, nomeArquivo: 'null.pdf', tipoAnexoId: 1, urlDownload: 'url2' },
        { arquivoCodigo: '0', nomeArquivo: 'zero.pdf', tipoAnexoId: 1, urlDownload: 'url3' },
        { arquivoCodigo: '', nomeArquivo: 'vazio.pdf', tipoAnexoId: 1, urlDownload: 'url4' },
        { arquivoCodigo: 'abc', nomeArquivo: 'abc.pdf', tipoAnexoId: 1, urlDownload: 'url5' },
      ];

      const anexosMapeados = mapearAnexosParaFormulario(anexos);

      expect(anexosMapeados).toEqual([
        {
          uid: '123',
          name: 'teste.pdf',
          status: 'done',
          xhr: '123',
          arquivoCodigo: '123',
          nomeArquivo: 'teste.pdf',
          tipoAnexoId: 1,
          urlDownload: 'url1',
        },
        {
          uid: 'abc',
          name: 'abc.pdf',
          status: 'done',
          xhr: 'abc',
          arquivoCodigo: 'abc',
          nomeArquivo: 'abc.pdf',
          tipoAnexoId: 1,
          urlDownload: 'url5',
        },
      ]);
    });
  });
});
