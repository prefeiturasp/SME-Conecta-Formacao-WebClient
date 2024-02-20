import { produce } from 'immer';

import { SetSpinning, typeSetSpinning } from './actions';

const initialValues = {
  spinning: false,
};

const spin = (state = initialValues, action: SetSpinning) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetSpinning:
        return { ...draft, spinning: action.payload };
      default:
        return draft;
    }
  });
};

export default spin;
