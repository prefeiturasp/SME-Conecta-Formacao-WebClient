import { InscricaoDTO } from '../dto/inscricao-dto';
import { inserirRegistro, obterRegistro } from './api';

export const URL_INSCRICAO = 'v1/Inscricao';

const obterInscricao = (propostaId: number) => {
  return obterRegistro<number>(`${URL_INSCRICAO}/inscricao/${propostaId}`);
};

const inserirInscricao = (params: InscricaoDTO) => {
  return inserirRegistro(URL_INSCRICAO, {
    params,
  });
};

export { inserirInscricao, obterInscricao };
