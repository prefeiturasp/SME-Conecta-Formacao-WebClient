import { AcaoInformativaDto } from '../dto/acao-informativa-url-dto';
import { CriterioValidacaoInscricaoDTO } from '../dto/criterio-validacao-inscricao-dto';
import { DevolverPropostaDTO } from '../dto/devolver-proposta-dto';
import { PropostaInformacoesCadastranteDTO } from '../dto/informacoes-cadastrante-dto';
import {
  PropostaParecerCompletoDTO,
  PropostaParecerFiltroDTO,
  PropostaPareceristaConsideracaoCadastroDTO,
} from '../dto/parecer-proposta-dto';
import { PropostaDashboardDTO } from '../dto/proposta-dashboard-dto';
import { PropostaCompletoDTO, PropostaDTO } from '../dto/proposta-dto';
import { PropostaEncontroDTO } from '../dto/proposta-encontro-dto';
import { PropostaFiltrosDTO } from '../dto/proposta-filtro-dto';
import { PropostaPareceristaSugestaoDTO } from '../dto/proposta-parecerista-sugestao-dto';
import { PropostaRegenteDTO } from '../dto/proposta-regente-dto';
import { PropostaTutorDTO } from '../dto/proposta-tutor-dto';
import { RetornoDTO } from '../dto/retorno-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { TipoFormacao } from '../enum/tipo-formacao';
import {
  ApiResult,
  alterarRegistro,
  alterarRegistroParcial,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';

export const URL_API_PROPOSTA = 'v1/Proposta';

export type PropostaAutocompletarDTO = {
  propostaId: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
};

export type PropostaAutocompletarRetornoDTO = {
  items: PropostaAutocompletarDTO[];
  totalRegistros: number;
  totalPaginas: number;
};

const autocompletarFormacao = (
  termoBusca: string,
): Promise<ApiResult<PropostaAutocompletarRetornoDTO>> => {
  const params = {
    TermoBusca: termoBusca,
    NumeroPagina: 1,
    NumeroRegistros: 99999,
  };
  return obterRegistro(`${URL_API_PROPOSTA}/autocompletar-formacao`, { params });
};

const obterCriterioValidacaoInscricao = (
  exibirOpcaoOutros: boolean,
): Promise<ApiResult<CriterioValidacaoInscricaoDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/criterio-validacao-inscricao`, {
    params: { exibirOpcaoOutros },
  });

const obterFormacaoHomologada = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/formacao-homologada`);

const obterFormato = (tipoFormacao: TipoFormacao): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/formatos/tipo-formacao/${tipoFormacao}`);

const obterSituacoes = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/situacao`);

const obterRoteiroPropostaFormativa = (): Promise<ApiResult<RetornoListagemDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/roteiro`);

const obterDadosCadastrante = (
  propostaId?: number,
): Promise<ApiResult<PropostaInformacoesCadastranteDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/informacoes-cadastrante`, { params: { propostaId } });

const obterComunicadoAcaoInformatica = (
  id: number | string,
): Promise<ApiResult<AcaoInformativaDto>> =>
  obterRegistro(`${URL_API_PROPOSTA}/comunicado-acao-formativa/${id}`);

const obterTipoFormacao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/tipo-formacao`);

const obterTipoInscricao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/tipo-inscricao`);

const inserirProposta = (params: PropostaDTO) =>
  inserirRegistro<RetornoDTO>(URL_API_PROPOSTA, params);

const alterarProposta = (id: string | number, params: PropostaDTO, mostrarNotificacao: boolean) =>
  alterarRegistro<RetornoDTO>(`${URL_API_PROPOSTA}/${id}`, params, undefined, mostrarNotificacao);

const devolverProposta = (
  id: string | number,
  params: DevolverPropostaDTO,
): Promise<ApiResult<RetornoDTO>> =>
  alterarRegistro<RetornoDTO>(`${URL_API_PROPOSTA}/devolver-proposta/${id}`, params);

const enviarPropostaAnalise = (
  id: string | number,
  params?: PropostaDTO,
): Promise<ApiResult<number>> =>
  alterarRegistroParcial<number>(`${URL_API_PROPOSTA}/${id}/enviar`, params);

const obterPropostaPorId = (id: string | number): Promise<ApiResult<PropostaCompletoDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/${id}`);

const deletarProposta = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_PROPOSTA}/${id}`);

const obterTurmasDaProposta = (id: number): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/${id}/turma`);

const obterTipoEncontro = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/tipo-encontro`);

const obterParecer = (
  params?: PropostaParecerFiltroDTO,
): Promise<ApiResult<PropostaParecerCompletoDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/parecer`, { params });

const salvarParecer = (params?: PropostaPareceristaConsideracaoCadastroDTO) =>
  inserirRegistro<RetornoDTO>(`${URL_API_PROPOSTA}/parecer`, params);

const alterarParecer = (params?: PropostaPareceristaConsideracaoCadastroDTO) =>
  alterarRegistro<RetornoDTO>(`${URL_API_PROPOSTA}/parecer`, params);

const enviarParecer = (propostaId: number) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/parecerista/enviar`);

const obterPropostaEncontrosPaginado = (
  propostaId: number | string,
): Promise<ApiResult<PropostaEncontroDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/${propostaId}/encontro`);

const salvarPropostaEncontro = (
  propostaId: number | string,
  encontro: PropostaEncontroDTO,
): Promise<ApiResult<number>> =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/encontro`, encontro);

const removerPropostaEncontro = (idEncontro: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_PROPOSTA}/encontro/${idEncontro}`);

const removerParecer = (parecerId?: number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_PROPOSTA}/parecer/${parecerId}`);

const obterNomeProfissional = (registroFunciona: string) =>
  obterRegistro<string>(`${URL_API_PROPOSTA}/nome-profissional/${registroFunciona}`);

const salvarPropostaProfissionalRegente = (
  params: PropostaRegenteDTO,
  propostaId: number | string,
) => inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/regente`, params);

const obterPropostaRegentePorId = (id: string | number) =>
  obterRegistro<PropostaRegenteDTO>(`${URL_API_PROPOSTA}/regente/${id}`);

const excluirRegente = (id: string | number) =>
  deletarRegistro<boolean>(`${URL_API_PROPOSTA}/regente/${id}`);

const salvarPropostaProfissionalTutor = (params: PropostaTutorDTO, propostaId: number | string) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/tutor`, params);

const excluirTutor = (id: string | number) =>
  deletarRegistro<boolean>(`${URL_API_PROPOSTA}/tutor/${id}`);

const obterPropostaTutorPorId = (id: string | number) =>
  obterRegistro<PropostaTutorDTO>(`${URL_API_PROPOSTA}/tutor/${id}`);

const obterPropostasDashboard = (filters: PropostaFiltrosDTO) =>
  obterRegistro<PropostaDashboardDTO[]>(`${URL_API_PROPOSTA}/dashboard`, { params: filters });

const obterRelatorioLaudaPublicacao = (propostaId: number) =>
  obterRegistro<string>(`${URL_API_PROPOSTA}/${propostaId}/relatorio/lauda-publicacao`);

const obterRelatorioLaudaCompleta = (propostaId: number) =>
  obterRegistro<string>(`${URL_API_PROPOSTA}/${propostaId}/relatorio/lauda-completa`);

const obterSugestoes = (propostaId: number) =>
  obterRegistro<PropostaPareceristaSugestaoDTO[]>(
    `${URL_API_PROPOSTA}/${propostaId}/parecerista/sugestao`,
  );

const aprovarConsideracoesPareceristas = (propostaId: number, justificativa: string) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/parecerista/aprovar`, {
    justificativa,
  });

const recusarConsideracoesPareceristas = (propostaId: number, justificativa: string) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/parecerista/recusar`, {
    justificativa,
  });

const aprovarConsideracoesAdminDf = (propostaId: number, justificativa: string) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/aprovar`, { justificativa });

const recusarConsideracoesAdminDf = (propostaId: number, justificativa: string) =>
  inserirRegistro<number>(`${URL_API_PROPOSTA}/${propostaId}/recusar`, { justificativa });

const obterCargaHorariaTotal = () =>
  obterRegistro<RetornoListagemDTO[]>(`${URL_API_PROPOSTA}/horas-totais-proposta`);

export {
  alterarParecer,
  alterarProposta,
  aprovarConsideracoesAdminDf,
  aprovarConsideracoesPareceristas,
  deletarProposta,
  devolverProposta,
  enviarParecer,
  enviarPropostaAnalise,
  excluirRegente,
  excluirTutor,
  inserirProposta,
  obterCargaHorariaTotal,
  obterComunicadoAcaoInformatica,
  obterCriterioValidacaoInscricao,
  obterDadosCadastrante,
  obterFormacaoHomologada,
  autocompletarFormacao,
  obterFormato,
  obterNomeProfissional,
  obterParecer,
  obterPropostaEncontrosPaginado,
  obterPropostaPorId,
  obterPropostaRegentePorId,
  obterPropostaTutorPorId,
  obterPropostasDashboard,
  obterRelatorioLaudaCompleta,
  obterRelatorioLaudaPublicacao,
  obterRoteiroPropostaFormativa,
  obterSituacoes,
  obterSugestoes,
  obterTipoEncontro,
  obterTipoFormacao,
  obterTipoInscricao,
  obterTurmasDaProposta,
  recusarConsideracoesAdminDf,
  recusarConsideracoesPareceristas,
  removerParecer,
  removerPropostaEncontro,
  salvarParecer,
  salvarPropostaEncontro,
  salvarPropostaProfissionalRegente,
  salvarPropostaProfissionalTutor,
};
