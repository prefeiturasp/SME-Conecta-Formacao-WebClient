import { InscricaoProps } from '~/pages/formacao-cursista/minhas-inscricoes/listagem';
import { CursistaDTO } from '../dto/cursista-dto';
import { DadosListagemInscricaoDTO } from '../dto/dados-listagem-inscricao-dto';
import { DadosInscricaoDTO, DadosVinculoInscricaoDTO, DadosInscricaoPropostaDto } from '../dto/dados-usuario-inscricao-dto';
import { InscricaoDTO } from '../dto/inscricao-dto';
import { InscricaoManualDTO } from '../dto/inscricao-manual-dto';
import { InscricaoMotivoCancelamentoDTO } from '../dto/inscricao-motivo-cancelamento-dto';
import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { PodeInscreverMensagemDTO } from '../dto/pode-inscrever-mensagem-dto';
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

const obterDadosInscricaoProposta = (propostaId: number) => {
  return obterRegistro<DadosInscricaoPropostaDto>(`${URL_INSCRICAO}/dados-inscricao-proposta/${propostaId}`);
}

const obterRfCpf = (rfCpf: string) => {
  const params = rfCpf && rfCpf.length > 7 ? { cpf: rfCpf } : { registroFuncional: rfCpf };

  return obterRegistro<CursistaDTO>(`${URL_INSCRICAO}/cursista`, { params });
};

const obterInscricao = () => {
  return obterRegistro<PaginacaoResultadoDTO<InscricaoProps[]>>(URL_INSCRICAO);
};

const obterInscricaoId = (id?: number | string) => {
  return obterRegistro<PaginacaoResultadoDTO<DadosListagemInscricaoDTO[]>>(
    `${URL_INSCRICAO}/${id}`,
  );
};

const cancelarInscricao = (id: number) => {
  return alterarRegistro(`${URL_INSCRICAO}/${id}/cancelar`);
};

const obterTurmasInscricao = (
  propostaId: number,
  codigoDre?: string,
): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_INSCRICAO}/turmas/${propostaId}`, { params: { codigoDre } });

const obterTiposInscricao = (): Promise<ApiResult<RetornoListagemDTO[]>> =>
  obterRegistro(`${URL_INSCRICAO}/tipos`);

const alterarVinculo = (params: DadosVinculoInscricaoDTO) =>
  alterarRegistro(`${URL_INSCRICAO}/${params.id}/alterar-vinculo`, params);

const obterSeInscricaoEstaAberta = (propostaId: number) =>
  obterRegistro<PodeInscreverMensagemDTO>(`${URL_INSCRICAO}/${propostaId}/abertas`);

const colocarEmEsperaInscricao = (ids: number[]) =>
  alterarRegistro<RetornoDTO>(`${URL_INSCRICAO}/em-espera`, null, { params: { ids } });

const confirmarInscricao = (ids: number[]) =>
  alterarRegistro<RetornoDTO>(`${URL_INSCRICAO}/confirmar`, null, { params: { ids } });

const reativarInscricao = (ids: number[]) =>
  alterarRegistro<RetornoDTO>(`${URL_INSCRICAO}/reativar`, null, { params: { ids } });

const cancelarInscricoes = (ids: number[], motivo: InscricaoMotivoCancelamentoDTO) =>
  alterarRegistro<RetornoDTO>(`${URL_INSCRICAO}/cancelar`, motivo, {
    params: { ids },
  });

const sortearInscricao = (propostaId: number) =>
  alterarRegistro<RetornoDTO>(`${URL_INSCRICAO}/sortear/${propostaId}`);

export {
  alterarVinculo,
  cancelarInscricao,
  cancelarInscricoes,
  colocarEmEsperaInscricao,
  confirmarInscricao,
  inserirInscricao,
  inserirInscricaoManual,
  obterDadosInscricao,
  obterInscricao,
  obterDadosInscricaoProposta,
  obterInscricaoId,
  obterRfCpf,
  obterSeInscricaoEstaAberta,
  obterTiposInscricao,
  obterTurmasInscricao,
  sortearInscricao,
  reativarInscricao,
};
