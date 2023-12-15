export enum Modalidade {
  EducacaoInfantil = 1,
  EJA = 3,
  CIEJA = 4,
  Fundamental = 5,
  Medio = 6,
  CMCT = 7,
  MOVA = 8,
  ETEC = 9,
  CELP = 10,
}

export const ModalidadeDisplay: Record<Modalidade, string> = {
  [Modalidade.EducacaoInfantil]: 'Educação Infantil',
  [Modalidade.EJA]: 'Educação de Jovens e Adultos',
  [Modalidade.CIEJA]: 'CIEJA',
  [Modalidade.Fundamental]: 'Ensino Fundamental',
  [Modalidade.Medio]: 'Ensino Médio',
  [Modalidade.CMCT]: 'CMCT',
  [Modalidade.MOVA]: 'MOVA',
  [Modalidade.ETEC]: 'ETEC',
  [Modalidade.CELP]: 'CELP',
};
