export type RetornoListagemDTO = {
  id: number;
  descricao?: string;
  possuiCodafListaPresenca?: boolean;
};

type RetornoListagemTodosDTO = {
  todos?: boolean;
} & RetornoListagemDTO;

export type DreDTO = {
  codigo?: string;
  value: number;
  label?: string;
} & RetornoListagemTodosDTO;
