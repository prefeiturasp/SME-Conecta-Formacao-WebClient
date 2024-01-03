export enum AreaPromotoraTipoEnum {
  RedeDireta = 1,
  RedeParceria = 2,
}

export const AreaPromotoraTipoEnumDisplay: Record<AreaPromotoraTipoEnum, string> = {
  [AreaPromotoraTipoEnum.RedeDireta]: 'Rede Direta',
  [AreaPromotoraTipoEnum.RedeParceria]: 'Rede Parceria',
};
