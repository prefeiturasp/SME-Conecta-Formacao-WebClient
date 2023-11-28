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
    colorPrimaryDark: Colors.SystemSME.ConectaFormacao.PRIMARY_DARK,
  },
  token: {
    fontFamily: 'Roboto',
    colorText: Colors.Neutral.DARK,
    colorPrimary: Colors.SystemSME.ConectaFormacao.PRIMARY,
    borderRadius: 4,
    controlHeight: 38,
    colorError: Colors.Suporte.Primary.ERROR,
  },
  components: {
    Button: {
      colorText: Colors.SystemSME.ConectaFormacao.PRIMARY,
      colorBorder: Colors.SystemSME.ConectaFormacao.PRIMARY,
    },
    Layout: {
      colorBgLayout: Colors.BACKGROUND_CONTENT,
    },
    Form: {
      paddingXS: 2,
    },
    Alert: {
      colorText: Colors.Neutral.WHITE,
      colorSuccessBg: Colors.Components.BACKGROUND_ALERT,
      colorErrorBg: Colors.Components.BACKGROUND_ALERT,
      colorWarningBg: Colors.Components.BACKGROUND_ALERT,
      colorInfoBg: Colors.Components.BACKGROUND_ALERT,
      colorError: Colors.Suporte.Primary.ERROR,
      colorSuccess: Colors.SUCCESS,
      colorWarning: Colors.WARNING,
      colorInfo: Colors.INFORMATION,
      fontWeightStrong: 700,
    },
    Notification: {
      colorText: Colors.Neutral.WHITE,
      colorSuccessBg: Colors.Components.BACKGROUND_ALERT,
      colorErrorBg: Colors.Components.BACKGROUND_ALERT,
      colorWarningBg: Colors.Components.BACKGROUND_ALERT,
      colorInfoBg: Colors.Components.BACKGROUND_ALERT,
      colorError: Colors.Suporte.Primary.ERROR,
      colorSuccess: Colors.SUCCESS,
      colorWarning: Colors.WARNING,
      colorInfo: Colors.INFORMATION,
      fontWeightStrong: 700,
    },
  },
};
