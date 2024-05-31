import { DadosInscricaoCargoEolDTO } from './dados-usuario-inscricao-dto';

export type CursistaDTO = {
  nome: string;
  cpf: string;
  usuarioCargos: DadosInscricaoCargoEolDTO[];
};
