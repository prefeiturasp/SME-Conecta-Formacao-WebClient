export const typeSetSpinning = '@spin/setSpinning';

export interface SetSpinning {
  type: typeof typeSetSpinning;
  payload: boolean;
}

export const setSpinning = (payload: boolean): SetSpinning => {
  return {
    type: typeSetSpinning,
    payload,
  };
};
