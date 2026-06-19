export enum TipoEmissorEnum {
  DRE = 1,
  Coordenadoria = 2,
}

export const TipoEmissorEnumDisplay: Record<TipoEmissorEnum, string> = {
  [TipoEmissorEnum.DRE]: 'DRE',
  [TipoEmissorEnum.Coordenadoria]: 'Coordenadoria',
};