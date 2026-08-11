import { mapearAnexosParaFormulario, AnexoDetalheBase } from './mapear-anexos';

describe('mapearAnexosParaFormulario', () => {
  it('deve retornar lista vazia quando nenhum anexo é passado', () => {
    expect(mapearAnexosParaFormulario([])).toEqual([]);
  });

  it('deve retornar lista vazia quando undefined é passado', () => {
    expect(mapearAnexosParaFormulario(undefined)).toEqual([]);
  });

  it('deve mapear anexo válido corretamente', () => {
    const anexos: AnexoDetalheBase[] = [
      {
        arquivoCodigo: 'abc-123',
        nomeArquivo: 'documento.pdf',
        tipoAnexoId: 3,
        urlDownload: 'https://storage.example.com/abc-123',
      },
    ];

    const resultado = mapearAnexosParaFormulario(anexos);

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({
      uid: 'abc-123',
      name: 'documento.pdf',
      status: 'done',
      xhr: 'abc-123',
      arquivoCodigo: 'abc-123',
      nomeArquivo: 'documento.pdf',
      tipoAnexoId: 3,
      urlDownload: 'https://storage.example.com/abc-123',
    });
  });

  it('deve filtrar anexos com arquivoCodigo nulo', () => {
    const anexos: AnexoDetalheBase[] = [
      { arquivoCodigo: null as any, nomeArquivo: 'nulo.pdf', tipoAnexoId: 1 },
    ];

    expect(mapearAnexosParaFormulario(anexos)).toHaveLength(0);
  });

  it('deve filtrar anexos com arquivoCodigo vazio', () => {
    const anexos: AnexoDetalheBase[] = [
      { arquivoCodigo: '', nomeArquivo: 'vazio.pdf', tipoAnexoId: 1 },
    ];

    expect(mapearAnexosParaFormulario(anexos)).toHaveLength(0);
  });

  it('deve filtrar anexos com arquivoCodigo "0"', () => {
    const anexos: AnexoDetalheBase[] = [
      { arquivoCodigo: '0', nomeArquivo: 'zero.pdf', tipoAnexoId: 1 },
    ];

    expect(mapearAnexosParaFormulario(anexos)).toHaveLength(0);
  });

  it('deve filtrar inválidos e manter válidos em lista mista', () => {
    const anexos: AnexoDetalheBase[] = [
      { arquivoCodigo: '0', nomeArquivo: 'invalido.pdf', tipoAnexoId: 1 },
      { arquivoCodigo: 'valid-001', nomeArquivo: 'valido.pdf', tipoAnexoId: 2 },
      { arquivoCodigo: '', nomeArquivo: 'outro-invalido.pdf', tipoAnexoId: 3 },
    ];

    const resultado = mapearAnexosParaFormulario(anexos);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].arquivoCodigo).toBe('valid-001');
  });

  it('deve mapear múltiplos anexos válidos', () => {
    const anexos: AnexoDetalheBase[] = [
      { arquivoCodigo: 'cod-1', nomeArquivo: 'file1.pdf', tipoAnexoId: 1 },
      { arquivoCodigo: 'cod-2', nomeArquivo: 'file2.xlsx', tipoAnexoId: 2 },
    ];

    const resultado = mapearAnexosParaFormulario(anexos);
    expect(resultado).toHaveLength(2);
    expect(resultado[0].uid).toBe('cod-1');
    expect(resultado[1].uid).toBe('cod-2');
  });
});
