import { describe, expect, it } from '@jest/globals';
import { deveBloquearEdicaoCodaf, deveDesabilitarSalvarCodaf } from './codaf-salvar';

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
    ['data de publicacao no Diario Oficial', { ...camposCompletos, dataPublicacaoDiarioOficial: null }],
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

  it('permite salvar quando nao houve emissao de certificado', () => {
    expect(deveDesabilitarSalvarCodaf(false, { anexos: [] })).toBe(false);
  });

  it('bloqueia a edicao quando o CODAF esta finalizado ou com certificado emitido', () => {
    expect(deveBloquearEdicaoCodaf(true, false)).toBe(true);
    expect(deveBloquearEdicaoCodaf(false, true)).toBe(true);
    expect(deveBloquearEdicaoCodaf(false, false)).toBe(false);
  });
});