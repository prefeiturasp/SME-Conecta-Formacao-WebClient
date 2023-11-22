import { ThemeConfig } from 'antd';
import { Colors } from '../styles/colors';

export type ThemeConfigCustomColors = {
  colors: {
    colorPrimaryDark: string;
  };
};

export type ThemeConfigSME = ThemeConfigCustomColors & ThemeConfig;

export const ConectaFormacaoTheme: ThemeConfigSME = {
  colors: {
    colorPrimaryDark: Colors.ORANGE_CF_DARK,
  },
  token: {
    fontFamily: 'Roboto',
    colorText: Colors.TEXT,
    colorPrimary: Colors.ORANGE_CONECTA_FORMACAO,
    borderRadius: 4,
    controlHeight: 38,
    colorError: Colors.ERROR,
  },
  components: {
    Button: {
      colorText: Colors.ORANGE_CONECTA_FORMACAO,
      colorBorder: Colors.ORANGE_CONECTA_FORMACAO,
    },
    Layout: {
      colorBgLayout: Colors.BACKGROUND_CONTENT,
    },
    Form: {
      paddingXS: 2,
    },
  },
};
