type SuporteType = {
  INFO: string;
  ERROR: string;
  SUCCESS: string;
  WARNING: string;
};

type SystemSMEType = {
  PRIMARY: string;
  PRIMARY_DARK: string;
};
type ColorsType = {
  BACKGROUND_CONTENT: string;
  Secondary: {
    INFO: string;
  };
  SystemSME: {
    ConectaFormacao: SystemSMEType;
  };
  Components: {
    BACKGROUND_ALERT: string;
    TOOLTIP: string;
  };
  Suporte: {
    Primary: SuporteType;
    Secondary: SuporteType;
  };
  Neutral: {
    DARK: string;
    MEDIUM: string;
    LIGHT: string;
    LIGHTEST: string;
    WHITE: string;
    RED: string;
  };
};

const Colors: ColorsType = {
  BACKGROUND_CONTENT: '#F5F5F5',
  Secondary: {
    INFO: '#086397',
  },
  SystemSME: {
    ConectaFormacao: {
      PRIMARY: '#FF9A52',
      PRIMARY_DARK: '#E48F47',
    },
  },
  Components: {
    BACKGROUND_ALERT: '#333638',
    TOOLTIP: '#086397',
  },
  Suporte: {
    Primary: {
      INFO: '#086397',
      ERROR: '#B40C02',
      SUCCESS: '#297805',
      WARNING: '#C0640E',
    },
    Secondary: {
      INFO: '#5BBCF2',
      ERROR: '#FD756D',
      SUCCESS: '#8DC773',
      WARNING: '#EAAA5E',
    },
  },
  Neutral: {
    DARK: '#42474A',
    MEDIUM: '#6F777C',
    LIGHT: '#BFBFBF',
    LIGHTEST: '#F5F6F8',
    WHITE: '#FFFFFF',
    RED: '#B40C02',
  },
};

const BoxShadow = {
  DEFAULT: '0 .125rem .25rem rgba(0,0,0,.075)',
  CARD_CONTENT: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
  AFIX_HEADER: 'rgba(0, 0, 0, 0.15) 0px 1.5rem 1rem -18px',
};

export { Colors, BoxShadow };
