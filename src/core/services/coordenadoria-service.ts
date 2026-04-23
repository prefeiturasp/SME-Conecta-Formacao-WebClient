import { ApiResult, inserirRegistro } from "./api";

export const URL_API_COORDENADORIA = 'v1/Coordenadoria';

export type CadastroCoordenadoriaDTO = {
  id: number;
  nome: string;
  sigla: string;
}

export const criarCoordenadoria = (
    coordenadoria: CadastroCoordenadoriaDTO
) : Promise<ApiResult<any>> => {
    return inserirRegistro(URL_API_COORDENADORIA, coordenadoria);
}