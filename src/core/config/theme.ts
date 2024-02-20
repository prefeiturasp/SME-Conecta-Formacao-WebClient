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
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess: Colors.Suporte.Secondary.SUCCESS,
      colorSuccessBg: Colors.Components.BACKGROUND_ALERT,
      colorError: Colors.Suporte.Secondary.ERROR,
      colorErrorBg: Colors.Components.BACKGROUND_ALERT,
      colorWarning: Colors.Suporte.Secondary.WARNING,
      colorWarningBg: Colors.Components.BACKGROUND_ALERT,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorInfoBg: Colors.Components.BACKGROUND_ALERT,
    },
    Notification: {
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess: Colors.Suporte.Secondary.SUCCESS,
      colorError: Colors.Suporte.Secondary.ERROR,
      colorWarning: Colors.Suporte.Secondary.WARNING,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorBgElevated: Colors.Components.BACKGROUND_ALERT,
    },
  },
};
