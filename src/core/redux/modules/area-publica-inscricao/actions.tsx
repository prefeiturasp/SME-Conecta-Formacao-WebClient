import { FormacaoDTO } from '~/core/dto/formacao-dto';

export const typeSetDadosFormacao = '@auth/SetDadosFormacao';

export interface SetDadosFormacao {
  type: typeof typeSetDadosFormacao;
  payload: FormacaoDTO;
}

export const setDadosFormacao = (payload: FormacaoDTO): SetDadosFormacao => {
  return {
    type: typeSetDadosFormacao,
    payload,
  };
};
