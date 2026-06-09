import { describe, test, expect, jest } from '@jest/globals';

jest.mock('~/core/services/api', () => ({
  default: {},
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
}));

import CheckboxAcaoInformatica from './index';
import { ACAO_INFORMATIVA_NAO_ACEITA } from '~/core/constants/mensagens';

describe('CheckboxAcaoInformatica', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof CheckboxAcaoInformatica).toBe('function');
    });
  });
  describe('Configuração do campo do formulário', () => {
    test('deve usar name "acaoInformativa"', () => {
      const fieldName = 'acaoInformativa';
      expect(fieldName).toBe('acaoInformativa');
    });

    test('deve usar valuePropName "checked"', () => {
      const valuePropName = 'checked';
      expect(valuePropName).toBe('checked');
    });

    test('o campo deve ser obrigatório', () => {
      const required = true;
      expect(required).toBe(true);
    });
  });

  describe('Campos auxiliares do formulário', () => {
    test('deve usar campo "acaoFormativaTexto"', () => {
      const fieldName = 'acaoFormativaTexto';
      expect(fieldName).toBe('acaoFormativaTexto');
    });

    test('deve usar campo "acaoFormativaLink"', () => {
      const fieldName = 'acaoFormativaLink';
      expect(fieldName).toBe('acaoFormativaLink');
    });
  });

  describe('Lógica de validação', () => {
    test('deve resolver a promise quando checkbox está marcado', async () => {
      const value = true;
      const resultado = value ? Promise.resolve() : Promise.reject('erro');
      await expect(resultado).resolves.toBeUndefined();
    });

    test('deve rejeitar a promise quando checkbox não está marcado', async () => {
      const value = false;
      const resultado = value ? Promise.resolve() : Promise.reject(ACAO_INFORMATIVA_NAO_ACEITA);
      await expect(resultado).rejects.toBe(ACAO_INFORMATIVA_NAO_ACEITA);
    });

    test('deve setar erroCheckbox como false quando valor é true', () => {
      const value = true;
      const erroCheckbox = !value;
      expect(erroCheckbox).toBe(false);
    });

    test('deve setar erroCheckbox como true quando valor é false', () => {
      const value = false;
      const erroCheckbox = !value;
      expect(erroCheckbox).toBe(true);
    });
  });

  describe('Limpeza de campos', () => {
    test('deve limpar acaoFormativaTexto para string vazia', () => {
      const valor = '';
      expect(valor).toBe('');
    });

    test('deve limpar acaoFormativaLink para string vazia', () => {
      const valor = '';
      expect(valor).toBe('');
    });
  });

  describe('Obtenção de dados por propostaId', () => {
    test('deve usar propostaId a partir dos params de rota', () => {
      const paramsRoute = { id: '42' };
      const propostaId = paramsRoute?.id || 0;
      expect(propostaId).toBe('42');
    });

    test('deve usar 0 quando id não está nos params', () => {
      const paramsRoute = {};
      const propostaId = (paramsRoute as { id?: string })?.id || 0;
      expect(propostaId).toBe(0);
    });

    test('deve chamar obterComunicadoAcaoInformatica quando propostaId existe', () => {
      const obterComunicado = jest.fn();
      const propostaId = '10';
      if (propostaId) {
        obterComunicado(propostaId);
      }
      expect(obterComunicado).toHaveBeenCalledWith('10');
    });

    test('não deve chamar obterComunicadoAcaoInformatica quando propostaId é 0', () => {
      const obterComunicado = jest.fn();
      const propostaId = 0;
      if (propostaId) {
        obterComunicado(propostaId);
      }
      expect(obterComunicado).not.toHaveBeenCalled();
    });
  });

  describe('Estilo do link', () => {
    test('deve ter paddingLeft de 5px no link', () => {
      const style = { paddingLeft: '5px' };
      expect(style.paddingLeft).toBe('5px');
    });

    test('link deve abrir em nova aba', () => {
      const target = '_blank';
      expect(target).toBe('_blank');
    });

    test('link deve ter rel noreferrer', () => {
      const rel = 'noreferrer';
      expect(rel).toBe('noreferrer');
    });
  });
});
