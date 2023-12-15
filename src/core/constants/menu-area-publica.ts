export enum AreaPublicaEnum {
  Home = 0,
  EventosExternos = 1,
  EventoEscola = 2,
  Faq = 3,
  QuemSomos = 4,
  SejaParceiro = 5,
  Contato = 6,
  Login = 7,
}

export const MENU_AREA_PUBLICA = {
  HOME: {
    LABEL: 'Home',
    KEY: AreaPublicaEnum.Home,
  },
  EVENTOS_EXTERNO: {
    LABEL: 'Eventos externos',
    KEY: AreaPublicaEnum.EventosExternos,
  },
  EVENTOS_ESCOLA: {
    LABEL: 'Eventos na escola',
    KEY: AreaPublicaEnum.EventoEscola,
  },
  FAQ: {
    LABEL: 'FAQ',
    KEY: AreaPublicaEnum.Faq,
  },
  QUEM_SOMOS: {
    LABEL: 'Quem Somos',
    KEY: AreaPublicaEnum.QuemSomos,
  },
  SEJA_PARCEITO: {
    LABEL: 'Seja Parceiro',
    KEY: AreaPublicaEnum.SejaParceiro,
  },
  CONTATO: {
    LABEL: 'Contato',
    KEY: AreaPublicaEnum.Contato,
  },
  LOGIN: {
    LABEL: 'Login',
    KEY: AreaPublicaEnum.Login,
  },
};
