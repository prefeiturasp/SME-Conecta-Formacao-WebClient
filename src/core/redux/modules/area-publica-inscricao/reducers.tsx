import { produce } from 'immer';

import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { SetDadosFormacao, typeSetDadosFormacao } from './actions';

type InitialValuesProps = {
  formacao: FormacaoDTO;
};

const initialValues: InitialValuesProps = {
  formacao: {},
};

const inscricao = (state: InitialValuesProps = initialValues, action: SetDadosFormacao) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetDadosFormacao:
        return { ...draft, formacao: action.payload };
      default:
        return draft;
    }
  });
};

export default inscricao;
