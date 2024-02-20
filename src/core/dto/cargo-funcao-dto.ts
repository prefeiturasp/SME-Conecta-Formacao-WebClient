import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';

export type CargoFuncaoDTO = {
  id: number;
  nome: string;
  tipo: CargoFuncaoTipo;
  outros?: boolean;
};
