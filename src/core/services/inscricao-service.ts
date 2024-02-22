import { InscricaoProps } from '~/pages/formacao-cursista/minhas-inscricoes/listagem';
import { DadosInscricaoDTO } from '../dto/dados-usuario-inscricao-dto';
import { InscricaoDTO } from '../dto/inscricao-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, inserirRegistro, obterRegistro } from './api';

export const URL_INSCRICAO = 'v1/Inscricao';

const inserirInscricao = (params: InscricaoDTO) => {
  return inserirRegistro(URL_INSCRICAO, params);
};

const obterDadosInscricao = () => {
  return obterRegistro<DadosInscricaoDTO>(`${URL_INSCRICAO}/dados-inscricao`);
};

const obterInscricao = () => {
  return obterRegistro<PaginacaoResultadoDTO<InscricaoProps[]>>(URL_INSCRICAO);
};

const cancelarInscricao = (id: number) => {
  return alterarRegistro(`${URL_INSCRICAO}/${id}/cancelar`);
};

const obterTurmasInscricao = (propostaId: number): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_INSCRICAO}/turmas/${propostaId}`);

const obterTiposInscricao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_INSCRICAO}/tipos`);

export {
  cancelarInscricao,
  inserirInscricao,
  obterDadosInscricao,
  obterInscricao,
  obterTurmasInscricao,
  obterTiposInscricao,
};
