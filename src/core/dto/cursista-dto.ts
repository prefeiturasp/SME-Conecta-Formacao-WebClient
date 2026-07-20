import { DadosInscricaoCargoEolDTO } from './dados-usuario-inscricao-dto';

export type CursistaDTO = {
  nome: string;
  cpf: string;
  usuarioCargos: DadosInscricaoCargoEolDTO[];
};

export interface RegrasAprovacaoCursistaCodafDto {
  frequenciaMinima: number;
  conceitosAceitos: string[];
  exigeAtividadeObrigatoria: boolean;
  possuiRegraAvaliacao: boolean;
}