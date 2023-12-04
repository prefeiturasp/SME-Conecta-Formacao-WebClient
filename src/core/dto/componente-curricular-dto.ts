import { ComponenteCurricularEnum } from '../enum/componente-curricular-enum';

export type ComponenteCurricularDTO = {
  id: number;
  nome: string;
  tipo: ComponenteCurricularEnum;
  todos?: boolean;
};
