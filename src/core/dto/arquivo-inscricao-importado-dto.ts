import { SituacaoImportacaoArquivoEnum } from '../enum/situacao-importacao-arquivo-enum';

export interface ArquivoInscricaoImportadoDTO {
  id: number;
  nome: string;
  situacao: SituacaoImportacaoArquivoEnum;
  totalRegistros: number;
  totalProcessados: number;
}
