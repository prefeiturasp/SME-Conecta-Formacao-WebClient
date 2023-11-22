import { combineReducers } from 'redux';
import auth from './auth/reducers';
import spin from './spin/reducers';
import perfil from './spin/reducers';
import roles from './roles/reducers';
import { typeSetDeslogar } from './auth/actions';

const appReducer = combineReducers({
  auth,
  spin,
  perfil,
  roles,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === typeSetDeslogar) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
