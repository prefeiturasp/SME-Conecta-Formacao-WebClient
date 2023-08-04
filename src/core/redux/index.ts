import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet, setAutoFreeze } from 'immer';
import rootReducer from './modules/reducers';

// Fixes "Cannot assign to read only property" error message
// when modifying objects from Redux state directly.
setAutoFreeze(false);

const persistConfig = {
  key: 'sme-conecta-formacao',
  storage,
  whitelist: ['auth'],
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

export { store, persistor };
