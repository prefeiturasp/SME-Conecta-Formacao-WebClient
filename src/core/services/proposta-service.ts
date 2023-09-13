import { CriterioValidacaoInscricaoDTO } from '../dto/criterio-validacao-inscricao-dto';
import { PropostaInformacoesCadastranteDTO } from '../dto/informacoes-cadastrante-dto';
import { PropostaCompletoDTO, PropostaDTO } from '../dto/proposta-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

export const URL_API_PROPOSTA = 'v1/Proposta';

const obterCriterioValidacaoInscricao = (): Promise<ApiResult<CriterioValidacaoInscricaoDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/criterio-validacao-inscricao?exibirOpcaoOutros=true`);

const obterModalidades = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/modalidades`);

const obterDadosCadastrante = (): Promise<ApiResult<PropostaInformacoesCadastranteDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/infornacoes-cadastrante`);

const obterTipoFormacao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/tipo-formacao`);

const obterTipoInscricao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_API_PROPOSTA}/tipo-inscricao`);

const inserirProposta = (params: PropostaDTO): Promise<ApiResult<number>> =>
  inserirRegistro<number>(URL_API_PROPOSTA, params);

const alterarProposta = (
  id: string | number,
  params: PropostaDTO,
): Promise<ApiResult<PropostaDTO>> =>
  alterarRegistro<PropostaDTO>(`${URL_API_PROPOSTA}/${id}`, params);

const obterPropostaPorId = (id: string | number): Promise<ApiResult<PropostaCompletoDTO>> =>
  obterRegistro(`${URL_API_PROPOSTA}/${id}`);

const deletarProposta = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_PROPOSTA}/${id}`);

export {
  alterarProposta,
  deletarProposta,
  inserirProposta,
  obterCriterioValidacaoInscricao,
  obterModalidades,
  obterPropostaPorId,
  obterTipoFormacao,
  obterTipoInscricao,
  obterDadosCadastrante,
};
