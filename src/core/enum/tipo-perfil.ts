export enum TipoPerfilEnum {
  AdminDF = 1,
  Cursista = 2,
  DF = 3,
  Parecerista = 4,
}

export const TipoPerfilTagDisplay: Record<TipoPerfilEnum, string> = {
  [TipoPerfilEnum.AdminDF]: 'Admin DF',
  [TipoPerfilEnum.Cursista]: 'Cursista',
  [TipoPerfilEnum.DF]: 'DF',
  [TipoPerfilEnum.Parecerista]: 'Parecerista',
};
