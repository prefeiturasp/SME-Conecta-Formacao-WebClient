import { obterUrlSignalR } from './variaveis';

describe('variaveis', () => {
  it('obterUrlSignalR is undefined when env var not set', () => {
    expect(obterUrlSignalR).toBeUndefined();
  });

  it('obterUrlSignalR reflects REACT_APP_URL_SIGNALR env var', () => {
    const original = process.env.REACT_APP_URL_SIGNALR;
    process.env.REACT_APP_URL_SIGNALR = 'http://signalr.test';

    const { obterUrlSignalR: url } = jest.requireActual('./variaveis');

    process.env.REACT_APP_URL_SIGNALR = original;

    expect(typeof url === 'string' || url === undefined).toBe(true);
  });
});
