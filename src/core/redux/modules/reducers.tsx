import { combineReducers } from 'redux';
import auth from './auth/reducers';
import spin from './spin/reducers';
import { typeSetDeslogar } from './auth/actions';

const appReducer = combineReducers({
  auth,
  spin,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === typeSetDeslogar) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
