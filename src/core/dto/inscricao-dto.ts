import { InscricaoArquivoDTO } from './inscricao-arquivo-dto';
import { IncricaoCargoDTO } from './inscricao-cargo-dto';
import { IncricaoFuncaoDTO } from './inscricao-funcao-dto';
import { InscricaoTurmaDTO } from './inscricao-turma-dto';

export type InscricaoDTO = {
  propostaTurmaId: InscricaoTurmaDTO[];
  email: string;
  cargoId: IncricaoCargoDTO[] | string;
  funcaoId: IncricaoFuncaoDTO[];
  arquivoId: InscricaoArquivoDTO[];
};
