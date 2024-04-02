import { InscricaoProps } from '~/pages/formacao-cursista/minhas-inscricoes/listagem';
import { CursistaDTO } from '../dto/cursista-dto';
import { DadosInscricaoDTO, DadosVinculoInscricaoDTO } from '../dto/dados-usuario-inscricao-dto';
import { InscricaoDTO } from '../dto/inscricao-dto';
import { InscricaoManualDTO } from '../dto/inscricao-manual-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { RetornoDTO } from '../dto/retorno-dto';
import { RetornoListagemDTO } from '../dto/retorno-listagem-dto';
import { ApiResult, alterarRegistro, inserirRegistro, obterRegistro } from './api';

export const URL_INSCRICAO = 'v1/Inscricao';

const inserirInscricao = (params: InscricaoDTO) => {
  return inserirRegistro<RetornoDTO>(URL_INSCRICAO, params);
};

const inserirInscricaoManual = (params: InscricaoManualDTO, mostrarNotificacao?: boolean) => {
  return inserirRegistro(`${URL_INSCRICAO}/manual`, params, undefined, mostrarNotificacao);
};

const obterDadosInscricao = () => {
  return obterRegistro<DadosInscricaoDTO>(`${URL_INSCRICAO}/dados-inscricao`);
};

const obterRfCpf = (rfCpf: string) => {
  const params = rfCpf && rfCpf.length > 7 ? { cpf: rfCpf } : { registroFuncional: rfCpf };

  return obterRegistro<CursistaDTO>(`${URL_INSCRICAO}/cursista`, { params });
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

const alterarVinculo = (params: DadosVinculoInscricaoDTO) =>
  alterarRegistro(`${URL_INSCRICAO}/${params.id}/alterar-vinculo`, params);

export {
  cancelarInscricao,
  inserirInscricao,
  inserirInscricaoManual,
  obterDadosInscricao,
  obterInscricao,
  obterRfCpf,
  obterTiposInscricao,
  obterTurmasInscricao,
  alterarVinculo,
};
