import api, {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';
import {
  atualizarCodafNaoHomologado,
  baixarModeloTermoResponsabilidade,
  criarCodafNaoHomologado,
  excluirCodafNaoHomologado,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
  obterCodafNaoHomologadoPorId,
  obterInscritosTurma,
  obterListaCodafNaoHomologado,
  emitirDeclaracaoCodafNaoHomologado,
  montarParametrosFiltroCodafNaoHomologado,
  URL_API_CODAF_CURSO_NAO_HOMOLOGADO,
} from './codaf-nao-homologado-service';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
}));

describe('codaf-nao-homologado-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterListaCodafNaoHomologado', () => {
    it('deve utilizar paginação padrão', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterListaCodafNaoHomologado({});

      expect(obterRegistro).toHaveBeenCalledWith(
        URL_API_CODAF_CURSO_NAO_HOMOLOGADO,
        {
          params: {
            NumeroPagina: 1,
            NumeroRegistros: 10,
          },
        }
      );
    });

    it('deve enviar todos os filtros preenchidos', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterListaCodafNaoHomologado({
        NumeroPagina: 2,
        NumeroRegistros: 20,
        NomeFormacao: 'Formação Teste',
        CodigoFormacao: 123,
        NumeroHomologacao: 456,
        PropostaTurmaId: 789,
        AreaPromotoraId: 10,
        Status: 1,
        DataFinalizacao: '2026-08-10',
      });

      expect(obterRegistro).toHaveBeenCalledWith(
        URL_API_CODAF_CURSO_NAO_HOMOLOGADO,
        {
          params: {
            NumeroPagina: 2,
            NumeroRegistros: 20,
            NomeFormacao: 'Formação Teste',
            CodigoFormacao: 123,
            NumeroHomologacao: 456,
            PropostaTurmaId: 789,
            AreaPromotoraId: 10,
            Status: 1,
            DataFinalizacao: '2026-08-10',
          },
        }
      );
    });
  });

  describe('criarCodafNaoHomologado', () => {
    it('deve inserir registro', async () => {
      (inserirRegistro as jest.Mock).mockResolvedValue({});
      const dados = { propostaId: 1, propostaTurmaId: 1, observacao: 'teste', inscritos: [] };

      await criarCodafNaoHomologado(dados);

      expect(inserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_CURSO_NAO_HOMOLOGADO, dados);
    });
  });

  describe('atualizarCodafNaoHomologado', () => {
    it('deve alterar registro', async () => {
      (alterarRegistro as jest.Mock).mockResolvedValue({});
      const dados = { propostaId: 1, propostaTurmaId: 1, observacao: 'teste', inscritos: [] };

      await atualizarCodafNaoHomologado(5, dados);

      expect(alterarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/5`, dados);
    });
  });

  describe('obterCodafNaoHomologadoPorId', () => {
    it('deve obter registro', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterCodafNaoHomologadoPorId(5);

      expect(obterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/5`);
    });
  });

  describe('obterInscritosTurma', () => {
    it('deve obter inscritos com paginação padrão', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterInscritosTurma(10);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/inscritos-turma/10`,
        {
          params: {
            numeroPagina: 1,
            numeroRegistros: 9999,
          },
        }
      );
    });

    it('deve obter inscritos com parametros customizados', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({});

      await obterInscritosTurma(10, 2, 50);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/inscritos-turma/10`,
        {
          params: {
            numeroPagina: 2,
            numeroRegistros: 50,
          },
        }
      );
    });
  });

  describe('baixarModeloTermoResponsabilidade', () => {
    it('deve chamar api.get com responseType arraybuffer', async () => {
      (api.get as jest.Mock).mockResolvedValue({});

      await baixarModeloTermoResponsabilidade();

      expect(api.get).toHaveBeenCalledWith(
        `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/termo-responsabilidade/modelo`,
        {
          responseType: 'arraybuffer',
        }
      );
    });
  });

  describe('fazerUploadAnexoCodaf', () => {
    it('deve inserir registro temporario com formData', async () => {
      (inserirRegistro as jest.Mock).mockResolvedValue({});
      const formData = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      await fazerUploadAnexoCodaf(formData, config);

      expect(inserirRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/anexos/temporarios`,
        formData,
        config
      );
    });
  });

  describe('obterAnexoCodafParaDownload', () => {
    it('deve chamar api.get com arquivoCodigo', async () => {
      (api.get as jest.Mock).mockResolvedValue({});

      await obterAnexoCodafParaDownload('abc1234');

      expect(api.get).toHaveBeenCalledWith(
        `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/anexos/abc1234`,
        {
          responseType: 'arraybuffer',
        }
      );
    });
  });

  describe('excluirCodafNaoHomologado', () => {
    it('deve deletar registro', async () => {
      (deletarRegistro as jest.Mock).mockResolvedValue({});

      await excluirCodafNaoHomologado(5);

      expect(deletarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/5`);
    });
  });

  describe('emitirDeclaracaoCodafNaoHomologado', () => {
    it('deve chamar api.post para emitir declaracao', async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await emitirDeclaracaoCodafNaoHomologado(5);

      expect(api.post).toHaveBeenCalledWith(`v1/CodafDeclaracao/5/emitir`);
    });
  });

  describe('montarParametrosFiltroCodafNaoHomologado', () => {
    it('deve montar os parametros corretos quando incluirDataFinalizacao for falso', () => {
      const crivos = {
        NumeroPagina: 2,
        NumeroRegistros: 20,
        DataFinalizacao: '2026-08-10',
        Status: 0,
      };

      const params = montarParametrosFiltroCodafNaoHomologado(crivos, false);

      expect(params).toEqual({
        NumeroPagina: 2,
        NumeroRegistros: 20,
        Status: 0,
      });
    });

    it('deve montar os parametros corretos quando incluirDataFinalizacao for verdadeiro', () => {
      const crivos = {
        NumeroPagina: 1,
        NumeroRegistros: 10,
        DataFinalizacao: '2026-08-10',
      };

      const params = montarParametrosFiltroCodafNaoHomologado(crivos, true);

      expect(params).toEqual({
        NumeroPagina: 1,
        NumeroRegistros: 10,
        DataFinalizacao: '2026-08-10',
      });
    });

    it('deve montar os parametros corretos usando o valor padrao (false) de incluirDataFinalizacao', () => {
      const crivos = {
        NumeroPagina: 3,
        NumeroRegistros: 15,
        DataFinalizacao: '2026-08-10',
      };

      const params = montarParametrosFiltroCodafNaoHomologado(crivos);

      expect(params).toEqual({
        NumeroPagina: 3,
        NumeroRegistros: 15,
      });
    });
  });
});
