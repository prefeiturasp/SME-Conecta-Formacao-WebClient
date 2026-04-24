import { alterarRegistro, ApiResult, deletarRegistro, inserirRegistro, obterRegistro } from "./api";

export const URL_API_COORDENADORIA = 'v1/Coordenadoria';

export type AreaPromotoraDTO = {
    id: number;
    nome: string;
};

export type CadastroCoordenadoriaDTO = {
    id: number;
    nome: string;
    sigla: string;
    alteradoEm?: string | null;
    alteradoPor?: string | null;
    alteradoLogin?: string | null;
    criadoEm?: string;
    criadoPor?: string;
    criadoLogin?: string;
    areasPromotoras?: AreaPromotoraDTO[];
}

export const criarCoordenadoria = (
    dados: CadastroCoordenadoriaDTO
) : Promise<ApiResult<any>> => {
    return inserirRegistro(URL_API_COORDENADORIA, dados);
}

export const atualizarCoordenadoria = (
    id: number,
    dados: CadastroCoordenadoriaDTO
) : Promise<ApiResult<any>> => {
    return alterarRegistro(`${URL_API_COORDENADORIA}/${id}`, dados);
}

export const obterCoordenadoriaPorId = (
    id: number
) : Promise<ApiResult<CadastroCoordenadoriaDTO>> => {
    return obterRegistro(`${URL_API_COORDENADORIA}/${id}`);
}

export const excluirCoordenadoria = (
    id: number
) : Promise<ApiResult<any>> => {
    return deletarRegistro(`${URL_API_COORDENADORIA}/${id}`);
}