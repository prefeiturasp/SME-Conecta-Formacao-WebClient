import { describe, expect, it } from '@jest/globals';
import {
  deveBloquearEdicaoCodaf,
  deveDesabilitarCamposEol,
  deveDesabilitarSalvarCodaf,
  podeEditarCamposEolCodaf,
} from './codaf-salvar';

const camposCompletos = {
  numeroComunicado: 1234,
  dataPublicacao: '2026-01-10',
  paginaComunicado: 45,
  dataPublicacaoDiarioOficial: '2026-01-11',
  codigoCursoEol: 998877,
  anexos: [{ uid: 'anexo-1', name: 'arquivo.pdf' }],
};

describe('deveDesabilitarSalvarCodaf', () => {
  it.each([
    ['numero do comunicado', { ...camposCompletos, numeroComunicado: undefined }],
    ['data do comunicado', { ...camposCompletos, dataPublicacao: null }],
    ['pagina do comunicado', { ...camposCompletos, paginaComunicado: undefined }],
    [
      'data de publicacao no Diario Oficial',
      { ...camposCompletos, dataPublicacaoDiarioOficial: null },
    ],
    ['codigo do curso no EOL', { ...camposCompletos, codigoCursoEol: undefined }],
    ['anexo', { ...camposCompletos, anexos: [] }],
  ])('bloqueia o Salvar quando falta %s', (_campo, campos) => {
    expect(deveDesabilitarSalvarCodaf(true, campos)).toBe(true);
  });

  it('permite salvar quando todos os campos obrigatorios estao preenchidos', () => {
    expect(deveDesabilitarSalvarCodaf(true, camposCompletos)).toBe(false);
  });

  it('bloqueia o Salvar com certificado emitido fora da situacao finalizado', () => {
    expect(deveDesabilitarSalvarCodaf(true, { anexos: [] })).toBe(true);
  });

  it('bloqueia o Salvar com certificado emitido e campos undefined', () => {
    expect(deveDesabilitarSalvarCodaf(true, undefined)).toBe(true);
  });

  it('permite salvar quando nao houve emissao de certificado', () => {
    expect(deveDesabilitarSalvarCodaf(false, { anexos: [] })).toBe(false);
  });

  it('bloqueia a edicao quando o CODAF esta finalizado ou com certificado emitido', () => {
    expect(deveBloquearEdicaoCodaf(true, false)).toBe(true);
    expect(deveBloquearEdicaoCodaf(false, true)).toBe(true);
    expect(deveBloquearEdicaoCodaf(false, false)).toBe(false);
  });
});

describe('podeEditarCamposEolCodaf', () => {
  it('permite edicao para perfil Admin DF', () => {
    expect(podeEditarCamposEolCodaf({ admin: true, df: false })).toBe(true);
  });

  it('permite edicao para perfil DF', () => {
    expect(podeEditarCamposEolCodaf({ admin: false, df: true })).toBe(true);
  });

  it('permite edicao se ambos admin e df forem true', () => {
    expect(podeEditarCamposEolCodaf({ admin: true, df: true })).toBe(true);
  });

  it('bloqueia edicao para perfis que nao sejam Admin DF ou DF', () => {
    expect(podeEditarCamposEolCodaf({ admin: false, df: false })).toBe(false);
    expect(podeEditarCamposEolCodaf({})).toBe(false);
    expect(podeEditarCamposEolCodaf(undefined)).toBe(false);
  });
});

describe('deveDesabilitarCamposEol', () => {
  it('habilita campos quando perfil for Admin DF e nao estiver finalizado', () => {
    expect(deveDesabilitarCamposEol({ admin: true, df: false }, false)).toBe(false);
  });

  it('habilita campos quando perfil for DF e nao estiver finalizado', () => {
    expect(deveDesabilitarCamposEol({ admin: false, df: true }, false)).toBe(false);
  });

  it('desabilita campos se o CODAF estiver finalizado, mesmo para Admin DF ou DF', () => {
    expect(deveDesabilitarCamposEol({ admin: true, df: false }, true)).toBe(true);
    expect(deveDesabilitarCamposEol({ admin: false, df: true }, true)).toBe(true);
  });

  it('desabilita campos para outros perfis mesmo nao finalizado', () => {
    expect(deveDesabilitarCamposEol({ admin: false, df: false }, false)).toBe(true);
    expect(deveDesabilitarCamposEol(undefined, false)).toBe(true);
  });
});
