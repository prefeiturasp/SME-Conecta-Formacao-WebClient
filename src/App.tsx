import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { ConectaFormacaoTheme } from './core/config/theme';
import { persistor, store } from './core/redux';
import Routes from './routes';

import GlobalStyle from '~/core/styles/global';
import Spin from './components/main/spin';

import { App as AppAntd } from 'antd';

declare global {
  interface Window {
    clarity: (identify: string, value: any) => void;
  }
}

const App = () => {
  return (
    <ConfigProvider theme={ConectaFormacaoTheme}>
      <ThemeProvider theme={ConectaFormacaoTheme}>
        <AppAntd>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <GlobalStyle />
              <Spin>
                <Routes />
              </Spin>
            </PersistGate>
          </Provider>
        </AppAntd>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
