import { produce } from 'immer';

import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { SetDadosInscricao, typeSetDadosInscricao } from './actions';

const initialValues: FormacaoDTO = {
  id: undefined,
  titulo: '',
  periodo: '',
  areaPromotora: '',
  tipoFormacao: undefined,
  tipoFormacaoDescricao: '',
  formato: undefined,
  formatoDescricao: '',
  inscricaoEncerrada: false,
  imagemUrl: '',
};

const inscricao = (state: FormacaoDTO = initialValues, action: SetDadosInscricao) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetDadosInscricao:
        return { ...draft, ...action.payload };
      default:
        return draft;
    }
  });
};

export default inscricao;
