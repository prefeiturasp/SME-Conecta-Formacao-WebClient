import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet, setAutoFreeze } from 'immer';
import rootReducer from './modules/reducers';

setAutoFreeze(false);

const persistConfig = {
  key: 'sme-conecta-formacao',
  storage,
  whitelist: ['auth', 'perfil', 'roles', 'inscricao'],
};

enableMapSet();

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof rootReducer>;

export { persistor, store };
