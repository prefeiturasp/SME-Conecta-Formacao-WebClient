import { RetornoListagemDTO } from './retorno-listagem-dto';

export type FuncionarioExternoDTO = {
  nomePessoa: string;
  cpf: string;
  codigoUnidade: string;
  nomeUnidade: string;
  ues: RetornoListagemDTO[];
};
