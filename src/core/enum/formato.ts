export enum Formato {
  Presencial = 1,
  Distancia = 2,
  Hibrido = 3,
}

export const FormatoDisplay: Record<Formato, string> = {
  [Formato.Presencial]: 'Presencial',
  [Formato.Distancia]: 'Distância',
  [Formato.Hibrido]: 'Híbrido',
};
