import App from './App';

jest.mock('antd/dist/reset.css', () => ({}));

jest.mock('antd', () => ({
  ConfigProvider: ({ children }: any) => children,
  App: ({ children }: any) => children,
}));

jest.mock('styled-components', () => ({
  ThemeProvider: ({ children }: any) => children,
}));

jest.mock('react-redux', () => ({
  Provider: ({ children }: any) => children,
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}));

jest.mock('./components/lib/notification/index', () => () => null);

jest.mock('./components/main/spin', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

jest.mock('./routes', () => () => null);

jest.mock('~/core/styles/global', () => () => null);

jest.mock('./core/config/theme', () => ({
  ConectaFormacaoTheme: {},
}));

jest.mock('./core/redux', () => ({
  store: {},
  persistor: {},
}));

describe('App', () => {
  it('deve ser definido', () => {
    expect(App).toBeDefined();
  });

  it('deve criar o elemento React', () => {
    const element = App();

    expect(element).toBeTruthy();
  });
});