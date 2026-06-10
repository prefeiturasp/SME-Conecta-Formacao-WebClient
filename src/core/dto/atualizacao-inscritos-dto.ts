/**
 * @interface InscritoAtualizacaoDTO
 * @description Data transfer object representing a subscriber to be updated.
 */
export interface InscritoAtualizacaoDTO {
  id: number;
  nome: string;
  documento: string; // RF ou CPF
  frequencia?: string;
  atividadeObrigatoria?: 'Sim' | 'Não';
  conceitoFinal?: string;
  aprovado?: 'Sim' | 'Não';
}

/**
 * @interface FormularioAtualizacaoInscritos
 * @description Root form structure containing the list of subscribers.
 */
export interface FormularioAtualizacaoInscritos {
  inscritos: InscritoAtualizacaoDTO[];
}