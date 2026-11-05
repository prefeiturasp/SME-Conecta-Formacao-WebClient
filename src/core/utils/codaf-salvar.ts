export type CamposBloqueioSalvarCodaf = {
  numeroComunicado?: unknown;
  dataPublicacao?: unknown;
  paginaComunicado?: unknown;
  dataPublicacaoDiarioOficial?: unknown;
  codigoCursoEol?: unknown;
  anexos?: unknown[];
};

const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

export const deveBloquearEdicaoCodaf = (
  finalizado: boolean,
  certificadoEmitido: boolean,
): boolean => finalizado || certificadoEmitido;

export interface PerfilEdicaoCamposEol {
  admin?: boolean;
  df?: boolean;
}

export const podeEditarCamposEolCodaf = (perfil?: PerfilEdicaoCamposEol): boolean => {
  return Boolean(perfil?.admin || perfil?.df);
};

export const deveDesabilitarCamposEol = (
  perfil?: PerfilEdicaoCamposEol,
  finalizado?: boolean,
): boolean => {
  if (finalizado) {
    return true;
  }
  return !podeEditarCamposEolCodaf(perfil);
};

export const deveDesabilitarSalvarCodaf = (
  certificadoEmitido: boolean,
  campos?: CamposBloqueioSalvarCodaf,
): boolean => {
  if (!certificadoEmitido) {
    return false;
  }

  if (!campos) {
    return true;
  }

  const camposObrigatorios = [
    campos.numeroComunicado,
    campos.dataPublicacao,
    campos.paginaComunicado,
    campos.dataPublicacaoDiarioOficial,
    campos.codigoCursoEol,
  ];

  return camposObrigatorios.some(isEmptyValue) || isEmptyValue(campos.anexos);
};
