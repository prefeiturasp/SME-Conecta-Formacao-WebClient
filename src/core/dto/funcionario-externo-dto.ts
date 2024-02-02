import { RetornoListagemDTO } from './retorno-listagem-dto';

export type FuncionarioExternoDTO = {
  nomePessoa: string;
  cpf: string;
  codigoUE: string;
  nomeUe: string;
  ues: RetornoListagemDTO[];
};
