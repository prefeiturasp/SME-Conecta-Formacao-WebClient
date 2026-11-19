import {
  alterarRegistro,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';
import {
  atualizarCodafConferencia,
  CodafConferenciaCadastroDTO,
  criarCodafConferencia,
  excluirCodafConferencia,
  fazerUploadAnexoCodafConferencia,
  montarParametrosFiltroCodafConferencia,
  obterCodafConferenciaPorId,
  obterDetalhesPropostaConferenciaComTurmasPorId,
  obterInscritosTurmaConferencia,
  obterListaCodafConferencia,
  URL_API_CODAF_CONFERENCIA,
  verificarTurmaPossuiCodafConferencia,
} from './codaf-conferencia-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

describe('codaf-conferencia-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('montarParametrosFiltroCodafConferencia', () => {
    it('deve montar parametros padrao quando filtros estiverem vazios', () => {
      const params = montarParametrosFiltroCodafConferencia({});

      expect(params).toEqual({
        NumeroPagina: 1,
        NumeroRegistros: 10,
      });
    });

    it('deve montar todos os parametros quando informados', () => {
      const params = montarParametrosFiltroCodafConferencia({
        NumeroPagina: 2,
        NumeroRegistros: 20,
        PropostaTurmaId: 10,
        CodigoFormacao: 100,
        NomeFormacao: 'Conferencia',
        AreaPromotoraId: 5,
        NumeroHomologacao: 20261,
        DataCriacao: '2026-11-17',
        Status: 1,
      });

      expect(params).toEqual({
        NumeroPagina: 2,
        NumeroRegistros: 20,
        PropostaTurmaId: 10,
        CodigoFormacao: 100,
        NomeFormacao: 'Conferencia',
        AreaPromotoraId: 5,
        NumeroHomologacao: 20261,
        DataCriacao: '2026-11-17',
        Status: 1,
      });
    });
  });

  describe('obterListaCodafConferencia', () => {
    it('deve chamar obterRegistro com parametros montados', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

      await obterListaCodafConferencia({ NumeroPagina: 1, NumeroRegistros: 10, Status: 2 });

      expect(obterRegistro).toHaveBeenCalledWith(URL_API_CODAF_CONFERENCIA, {
        params: {
          NumeroPagina: 1,
          NumeroRegistros: 10,
          Status: 2,
        },
      });
    });
  });

  describe('obterCodafConferenciaPorId', () => {
    it('deve chamar obterRegistro com o id informado', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

      await obterCodafConferenciaPorId(42);

      expect(obterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CONFERENCIA}/42`);
    });
  });

  describe('criarCodafConferencia', () => {
    it('deve chamar inserirRegistro com o payload de cadastro', async () => {
      (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });
      const payload: CodafConferenciaCadastroDTO = {
        propostaId: 10,
        propostaTurmaId: 20,
        codigoCursoEol: 123,
        inscritos: [{ inscricaoId: 1, participou: true }],
      };

      await criarCodafConferencia(payload);

      expect(inserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_CONFERENCIA, payload);
    });
  });

  describe('atualizarCodafConferencia', () => {
    it('deve chamar alterarRegistro com id e payload', async () => {
      (alterarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });
      const payload: CodafConferenciaCadastroDTO = {
        propostaId: 10,
        propostaTurmaId: 20,
        inscritos: [],
      };

      await atualizarCodafConferencia(15, payload);

      expect(alterarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CONFERENCIA}/15`, payload);
    });
  });

  describe('excluirCodafConferencia', () => {
    it('deve chamar deletarRegistro com o id informado', async () => {
      (deletarRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

      await excluirCodafConferencia(15);

      expect(deletarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_CONFERENCIA}/15`);
    });
  });

  describe('obterInscritosTurmaConferencia', () => {
    it('deve buscar inscritos com paginacao padrao sem codafConferenciaId', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

      await obterInscritosTurmaConferencia(10);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/inscritos-turma/10`,
        {
          params: {
            numeroPagina: 1,
            numeroRegistros: 9999,
          },
        },
      );
    });

    it('deve buscar inscritos passando codafConferenciaId quando fornecido', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true });

      await obterInscritosTurmaConferencia(10, 2, 50, 99);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/inscritos-turma/10`,
        {
          params: {
            numeroPagina: 2,
            numeroRegistros: 50,
            codafConferenciaId: 99,
          },
        },
      );
    });
  });

  describe('obterDetalhesPropostaConferenciaComTurmasPorId', () => {
    it('deve chamar obterRegistro com o propostaId informado', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true, dados: null });

      await obterDetalhesPropostaConferenciaComTurmasPorId(100);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/propostas/100/detalhes-com-turmas`,
      );
    });
  });

  describe('verificarTurmaPossuiCodafConferencia', () => {
    it('deve chamar endpoint sem params quando codafConferenciaId nao for informado', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true, dados: false });

      await verificarTurmaPossuiCodafConferencia(20);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/turmas/20/possui-codaf`,
        undefined,
      );
    });

    it('deve chamar endpoint com params quando codafConferenciaId for informado', async () => {
      (obterRegistro as jest.Mock).mockResolvedValue({ sucesso: true, dados: true });

      await verificarTurmaPossuiCodafConferencia(20, 7);

      expect(obterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/turmas/20/possui-codaf`,
        {
          params: { codafConferenciaId: 7 },
        },
      );
    });
  });

  describe('fazerUploadAnexoCodafConferencia', () => {
    it('deve enviar formData para o endpoint de anexos temporarios', async () => {
      (inserirRegistro as jest.Mock).mockResolvedValue({ sucesso: true });
      const formData = new FormData();
      const header = { headers: { 'Content-Type': 'multipart/form-data' } };

      await fazerUploadAnexoCodafConferencia(formData, header);

      expect(inserirRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_CONFERENCIA}/anexos/temporarios`,
        formData,
        header,
      );
    });
  });
});
