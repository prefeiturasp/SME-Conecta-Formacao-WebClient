import { configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
} from 'redux-persist';
import {
  enableMapSet,
  setAutoFreeze,
} from 'immer';

jest.mock('@reduxjs/toolkit', () => ({
  configureStore: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn(),
  persistStore: jest.fn(),
}));

jest.mock('redux-persist/lib/storage', () => ({}));

jest.mock('redux-thunk', () => jest.fn());

jest.mock('immer', () => ({
  enableMapSet: jest.fn(),
  setAutoFreeze: jest.fn(),
}));

jest.mock('./modules/reducers', () => jest.fn());

describe('Store', () => {
  const mockStore = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      auth: {},
      perfil: {},
      roles: {},
      inscricao: {},
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (persistReducer as jest.Mock).mockImplementation(
      (_, reducer) => reducer,
    );

    (configureStore as jest.Mock).mockReturnValue(mockStore);

    (persistStore as jest.Mock).mockReturnValue({
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
    });
  });

  it('deve configurar a store corretamente', async () => {
    await import('./index');

    expect(setAutoFreeze).toHaveBeenCalledWith(false);

    expect(enableMapSet).toHaveBeenCalled();

    expect(persistReducer).toHaveBeenCalledWith(
      {
        key: 'sme-conecta-formacao',
        storage: {},
        whitelist: [
          'auth',
          'perfil',
          'roles',
          'inscricao',
        ],
      },
      expect.any(Function),
    );

    expect(configureStore).toHaveBeenCalledWith({
      reducer: expect.any(Function),
      middleware: [expect.any(Function)],
    });

    expect(persistStore).toHaveBeenCalledWith(mockStore);
  });

  it('deve exportar store e persistor', async () => {
    const module = await import('./index');

    expect(module.store).toBe(mockStore);
    expect(module.persistor).toBeDefined();
  });
});