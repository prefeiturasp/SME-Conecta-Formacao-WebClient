export enum TipoPerfilEnum {
  AdminDF = 1,
  Cursista = 2,
}

export const TipoPerfilTagDisplay: Record<TipoPerfilEnum, string> = {
  [TipoPerfilEnum.AdminDF]: 'Admin DF',
  [TipoPerfilEnum.Cursista]: 'Cursista',
};
