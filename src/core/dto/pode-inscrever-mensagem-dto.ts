export interface PodeInscreverMensagemDTO {
  podeInscrever: boolean;
  mensagem: string;
  tiposInscricao?: number[];
  nomeFormacao?: string;
}
