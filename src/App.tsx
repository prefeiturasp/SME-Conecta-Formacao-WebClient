import { ConfigProvider } from 'antd';
import { ConectaFormacaoTheme } from './core/config/theme';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { persistor, store } from './core/redux';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './routes';
import 'antd/dist/reset.css';

import GlobalStyle from '~/core/styles/global';
import Spin from './components/main/spin';

declare global {
  interface Window {
    clarity: (identify: string, value: any) => void;
  }
}

const App = () => {
  return (
    <ConfigProvider theme={ConectaFormacaoTheme}>
      <ThemeProvider theme={ConectaFormacaoTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GlobalStyle />
            <Spin>
              <Routes />
            </Spin>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
