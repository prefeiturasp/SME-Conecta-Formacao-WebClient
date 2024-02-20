import { combineReducers } from 'redux';
import inscricao from './area-publica-inscricao/reducers';
import { typeSetDeslogar } from './auth/actions';
import auth from './auth/reducers';
import perfil from './perfil/reducers';
import roles from './roles/reducers';
import spin from './spin/reducers';

const appReducer = combineReducers({
  auth,
  spin,
  perfil,
  roles,
  inscricao,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === typeSetDeslogar) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
