import {
  setSpinning,
  typeSetSpinning,
} from './actions';

describe('Spinning Actions', () => {
  describe('setSpinning', () => {
    it('deve criar a action com payload true', () => {
      const action = setSpinning(true);

      expect(action).toEqual({
        type: typeSetSpinning,
        payload: true,
      });
    });

    it('deve criar a action com payload false', () => {
      const action = setSpinning(false);

      expect(action).toEqual({
        type: typeSetSpinning,
        payload: false,
      });
    });

    it('deve retornar o type correto', () => {
      expect(setSpinning(true).type).toBe(typeSetSpinning);
    });

    it('deve manter o payload informado', () => {
      expect(setSpinning(true).payload).toBe(true);
      expect(setSpinning(false).payload).toBe(false);
    });

    it('deve criar uma nova action a cada chamada', () => {
      const action1 = setSpinning(true);
      const action2 = setSpinning(true);

      expect(action1).toEqual(action2);
      expect(action1).not.toBe(action2);
    });
  });

  describe('constantes', () => {
    it('deve possuir o valor correto para typeSetSpinning', () => {
      expect(typeSetSpinning).toBe('@spin/setSpinning');
    });
  });
});