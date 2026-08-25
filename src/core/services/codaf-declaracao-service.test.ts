import {
  downloadDeclaracoesLote,
  obterDeclaracoesCodaf,
} from './codaf-declaracao-service';
import api, { obterRegistro } from './api';

jest.mock('./api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
  obterRegistro: jest.fn(),
}));

const obterRegistroMock = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const postMock = api.post as jest.Mock;

describe('codaf-declaracao-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia os filtros preenchidos e a paginação informada', async () => {
    const retorno = { sucesso: true, dados: { items: [], totalPaginas: 0, totalRegistros: 0 } };
    obterRegistroMock.mockResolvedValue(retorno as any);

    await obterDeclaracoesCodaf({
      NumeroHomologacao: 10,
      NomeFormacao: 'Formação teste',
      CodigoFormacao: 20,
      CodigoDeclaracao: 30,
      TipoDeclaracao: 0,
      TipoEmissor: 1,
      DocumentoCursista: '123',
      DocumentoRegente: '456',
      NomeCursista: 'Cursista teste',
      DataEmissao: '2026-08-25',
      EmissorId: 40,
      TurmaId: 50,
      Pagina: 2,
      TamanhoPagina: 20,
    });

    expect(obterRegistroMock).toHaveBeenCalledWith('v1/CodafDeclaracao', {
      params: {
        NumeroHomologacao: 10,
        NomeFormacao: 'Formação teste',
        CodigoFormacao: 20,
        CodigoDeclaracao: 30,
        TipoDeclaracao: 0,
        TipoEmissor: 1,
        DocumentoCursista: '123',
        DocumentoRegente: '456',
        NomeCursista: 'Cursista teste',
        DataEmissao: '2026-08-25',
        EmissorId: 40,
        TurmaId: 50,
        Pagina: 2,
        TamanhoPagina: 20,
      },
    });
  });

  it('usa paginação padrão e não envia filtros vazios', async () => {
    obterRegistroMock.mockResolvedValue({ sucesso: true, dados: null } as any);

    await obterDeclaracoesCodaf({
      NomeFormacao: '',
      TipoDeclaracao: null,
      TipoEmissor: undefined,
      Pagina: 0,
      TamanhoPagina: 0,
    });

    expect(obterRegistroMock).toHaveBeenCalledWith('v1/CodafDeclaracao', {
      params: { Pagina: 1, TamanhoPagina: 10 },
    });
  });

  it('retorna o blob ao baixar declarações em lote', async () => {
    const blob = new Blob(['arquivo zip']);
    postMock.mockResolvedValue({ data: blob });

    const resultado = await downloadDeclaracoesLote([1, 2]);

    expect(postMock).toHaveBeenCalledWith('v1/CodafDeclaracao/download-lote', [1, 2], {
      responseType: 'blob',
    });
    expect(resultado).toEqual({ sucesso: true, blob });
  });

  it('retorna as mensagens de erro presentes no blob da API', async () => {
    const blobErro = { text: jest.fn().mockResolvedValue('{"mensagensErro":["Declaração indisponível"]}') };
    postMock.mockRejectedValue({ response: { data: blobErro } });

    const resultado = await downloadDeclaracoesLote([1]);

    expect(resultado).toEqual({
      sucesso: false,
      mensagensErro: ['Declaração indisponível'],
    });
  });

  it('retorna mensagem padrão quando o erro não contém JSON válido', async () => {
    const blobErro = { text: jest.fn().mockResolvedValue('erro inesperado') };
    postMock.mockRejectedValue({ response: { data: blobErro } });

    const resultado = await downloadDeclaracoesLote([1]);

    expect(resultado).toEqual({
      sucesso: false,
      mensagensErro: ['Erro ao baixar as declarações.'],
    });
  });
});