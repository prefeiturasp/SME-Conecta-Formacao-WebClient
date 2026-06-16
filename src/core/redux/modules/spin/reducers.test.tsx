import reducer from './reducers';
import { setSpinning } from './actions';

describe('Spin Reducer', () => {
  const initialState = {
    spinning: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o estado inicial quando o state for undefined', () => {
    const state = reducer(undefined, {
      type: '@@INIT',
    } as any);

    expect(state).toEqual(initialState);
  });

  it('deve atualizar spinning para true', () => {
    const state = reducer(initialState, setSpinning(true));

    expect(state).toEqual({
      spinning: true,
    });
  });

  it('deve atualizar spinning para false', () => {
    const state = reducer(
      {
        spinning: true,
      },
      setSpinning(false)
    );

    expect(state).toEqual({
      spinning: false,
    });
  });

  it('deve manter o estado para uma action desconhecida', () => {
    const stateAnterior = {
      spinning: true,
    };

    const state = reducer(stateAnterior, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(stateAnterior);
  });

  it('não deve alterar o estado original', () => {
    const stateAnterior = {
      spinning: false,
    };

    const state = reducer(stateAnterior, setSpinning(true));

    expect(state).not.toBe(stateAnterior);
    expect(stateAnterior.spinning).toBe(false);
    expect(state.spinning).toBe(true);
  });
});