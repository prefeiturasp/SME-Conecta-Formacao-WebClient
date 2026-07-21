import { ConectaFormacaoTheme } from './theme';
import { Colors } from '../styles/colors';

jest.mock('../styles/colors', () => ({
  Colors: {
    SystemSME: {
      ConectaFormacao: {
        PRIMARY_DARK: '#101010',
        PRIMARY: '#202020',
      },
    },
    Neutral: {
      DARK: '#303030',
      WHITE: '#ffffff',
    },
    Suporte: {
      Primary: {
        ERROR: '#ff0000',
      },
      Secondary: {
        SUCCESS: '#00aa00',
        ERROR: '#cc0000',
        WARNING: '#ffaa00',
        INFO: '#0088ff',
      },
    },
    Components: {
      BACKGROUND_ALERT: '#404040',
    },
    BACKGROUND_CONTENT: '#f5f5f5',
  },
}));

describe('ConectaFormacaoTheme', () => {
  it('deve configurar a cor primária escura customizada', () => {
    expect(ConectaFormacaoTheme.colors).toEqual({
      colorPrimaryDark:
        Colors.SystemSME.ConectaFormacao.PRIMARY_DARK,
    });
  });

  it('deve configurar corretamente os tokens globais', () => {
    expect(ConectaFormacaoTheme.token).toEqual({
      fontFamily: 'Roboto',
      colorText: Colors.Neutral.DARK,
      colorPrimary:
        Colors.SystemSME.ConectaFormacao.PRIMARY,
      borderRadius: 4,
      controlHeight: 38,
      colorError: Colors.Suporte.Primary.ERROR,
    });
  });

  it('deve configurar corretamente o componente Button', () => {
    expect(
      ConectaFormacaoTheme.components?.Button,
    ).toEqual({
      colorText:
        Colors.SystemSME.ConectaFormacao.PRIMARY,
      colorBorder:
        Colors.SystemSME.ConectaFormacao.PRIMARY,
    });
  });

  it('deve configurar corretamente o componente Layout', () => {
    expect(
      ConectaFormacaoTheme.components?.Layout,
    ).toEqual({
      colorBgLayout: Colors.BACKGROUND_CONTENT,
    });
  });

  it('deve configurar corretamente o componente Form', () => {
    expect(
      ConectaFormacaoTheme.components?.Form,
    ).toEqual({
      paddingXS: 2,
    });
  });

  it('deve configurar corretamente o componente Alert', () => {
    expect(
      ConectaFormacaoTheme.components?.Alert,
    ).toEqual({
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess:
        Colors.Suporte.Secondary.SUCCESS,
      colorSuccessBg:
        Colors.Components.BACKGROUND_ALERT,
      colorError:
        Colors.Suporte.Secondary.ERROR,
      colorErrorBg:
        Colors.Components.BACKGROUND_ALERT,
      colorWarning:
        Colors.Suporte.Secondary.WARNING,
      colorWarningBg:
        Colors.Components.BACKGROUND_ALERT,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorInfoBg:
        Colors.Components.BACKGROUND_ALERT,
    });
  });

  it('deve configurar corretamente o componente Notification', () => {
    expect(
      ConectaFormacaoTheme.components?.Notification,
    ).toEqual({
      fontSize: 16,
      colorText: Colors.Neutral.WHITE,
      colorTextHeading: Colors.Neutral.WHITE,
      colorIcon: Colors.Neutral.WHITE,
      colorSuccess:
        Colors.Suporte.Secondary.SUCCESS,
      colorError:
        Colors.Suporte.Secondary.ERROR,
      colorWarning:
        Colors.Suporte.Secondary.WARNING,
      colorInfo: Colors.Suporte.Secondary.INFO,
      colorBgElevated:
        Colors.Components.BACKGROUND_ALERT,
    });
  });

  it('deve possuir todos os componentes esperados', () => {
    expect(
      Object.keys(
        ConectaFormacaoTheme.components ?? {},
      ),
    ).toEqual([
      'Button',
      'Layout',
      'Form',
      'Alert',
      'Notification',
    ]);
  });

  it('deve possuir a configuração completa esperada', () => {
    expect(ConectaFormacaoTheme).toEqual({
      colors: {
        colorPrimaryDark:
          Colors.SystemSME.ConectaFormacao
            .PRIMARY_DARK,
      },
      token: {
        fontFamily: 'Roboto',
        colorText: Colors.Neutral.DARK,
        colorPrimary:
          Colors.SystemSME.ConectaFormacao.PRIMARY,
        borderRadius: 4,
        controlHeight: 38,
        colorError: Colors.Suporte.Primary.ERROR,
      },
      components: {
        Button: {
          colorText:
            Colors.SystemSME.ConectaFormacao
              .PRIMARY,
          colorBorder:
            Colors.SystemSME.ConectaFormacao
              .PRIMARY,
        },
        Layout: {
          colorBgLayout:
            Colors.BACKGROUND_CONTENT,
        },
        Form: {
          paddingXS: 2,
        },
        Alert: {
          fontSize: 16,
          colorText: Colors.Neutral.WHITE,
          colorTextHeading:
            Colors.Neutral.WHITE,
          colorIcon: Colors.Neutral.WHITE,
          colorSuccess:
            Colors.Suporte.Secondary.SUCCESS,
          colorSuccessBg:
            Colors.Components.BACKGROUND_ALERT,
          colorError:
            Colors.Suporte.Secondary.ERROR,
          colorErrorBg:
            Colors.Components.BACKGROUND_ALERT,
          colorWarning:
            Colors.Suporte.Secondary.WARNING,
          colorWarningBg:
            Colors.Components.BACKGROUND_ALERT,
          colorInfo:
            Colors.Suporte.Secondary.INFO,
          colorInfoBg:
            Colors.Components.BACKGROUND_ALERT,
        },
        Notification: {
          fontSize: 16,
          colorText: Colors.Neutral.WHITE,
          colorTextHeading:
            Colors.Neutral.WHITE,
          colorIcon: Colors.Neutral.WHITE,
          colorSuccess:
            Colors.Suporte.Secondary.SUCCESS,
          colorError:
            Colors.Suporte.Secondary.ERROR,
          colorWarning:
            Colors.Suporte.Secondary.WARNING,
          colorInfo:
            Colors.Suporte.Secondary.INFO,
          colorBgElevated:
            Colors.Components.BACKGROUND_ALERT,
        },
      },
    });
  });
});
