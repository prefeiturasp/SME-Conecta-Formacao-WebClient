export type FormularioDrawerEncontro = {
  turmas: number[];
  dataInicial: string;
  dataFinal: string;
  datas: Data[];
  horarios: string[];
  tipoEncontro: number;
  local: string;
};

export type Data = {
  dataInicial: string;
  dataFinal: string;
};
