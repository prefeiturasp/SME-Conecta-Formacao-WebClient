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

jest.mock('./codaf-service-shared', () => ({
  downloadDocumentosLote: jest.fn(),
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

  it('deve chamar downloadDocumentosLote com parametros corretos', async () => {
    const { downloadDocumentosLote } = require('./codaf-service-shared');
    (downloadDocumentosLote as jest.Mock).mockResolvedValue({ sucesso: true, blob: new Blob() });

    const resultado = await downloadDeclaracoesLote([1, 2]);

    expect(downloadDocumentosLote).toHaveBeenCalledWith(
      'v1/CodafDeclaracao/download-lote',
      [1, 2],
      'Erro ao baixar as declarações.'
    );
    expect(resultado.sucesso).toBe(true);
  });
});