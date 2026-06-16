import reducer from './reducers';
import { setDadosFormacao, typeSetDadosFormacao } from './actions';
import { FormacaoDTO } from '../../../../core/dto/formacao-dto';

describe('Reducer inscrição', () => {
  it('deve retornar o estado inicial quando action é desconhecida', () => {
    const state = reducer(undefined, {
      type: '@@INIT',
    } as any);

    expect(state).toEqual({
      formacao: {},
    });
  });

  it('deve atualizar a formação quando receber a action setDadosFormacao', () => {
    const payload = {
      id: 1,
      nome: 'Formação Teste',
    } as FormacaoDTO;

    const action = setDadosFormacao(payload);

    const state = reducer(undefined, action);

    expect(state).toEqual({
      formacao: payload,
    });
  });

  it('deve substituir a formação existente', () => {
    const initialState = {
      formacao: {
        id: 1,
        nome: 'Antiga',
      } as FormacaoDTO,
    };

    const novoPayload = {
      id: 2,
      nome: 'Nova Formação',
    } as FormacaoDTO;

    const state = reducer(
      initialState,
      {
        type: typeSetDadosFormacao,
        payload: novoPayload,
      }
    );

    expect(state.formacao).toEqual(novoPayload);
  });

  it('não deve alterar o estado para actions desconhecidas', () => {
    const initialState = {
      formacao: {
        id: 10,
        nome: 'Formação Atual',
      } as FormacaoDTO,
    };

    const state = reducer(initialState, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(initialState);
  });
});