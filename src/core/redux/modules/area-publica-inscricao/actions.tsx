import { FormacaoDTO } from '~/core/dto/formacao-dto';

export const typeSetDadosInscricao = '@auth/SetDadosInscricao';

export interface SetDadosInscricao {
  type: typeof typeSetDadosInscricao;
  payload: FormacaoDTO;
}

export const setDadosInscricao = (payload: FormacaoDTO): SetDadosInscricao => {
  return {
    type: typeSetDadosInscricao,
    payload,
  };
};
