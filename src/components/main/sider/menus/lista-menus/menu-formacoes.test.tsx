/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { criarMenuFormacoes, MENU_FORMACOES } from './menu-formacoes';

describe('MENU_FORMACOES', () => {
  it('deve configurar o menu Formações com seus submenus esperados', () => {
    expect(MENU_FORMACOES.key).toBe(MenuEnum.Formacoes);
    expect(MENU_FORMACOES.title).toBe('Formações');

    const keys = MENU_FORMACOES.children?.map((item) => item.key);
    expect(keys).toEqual([
      MenuEnum.Inscricoes,
      MenuEnum.ListaPresencaCodaf,
      MenuEnum.CodafSuplementar,
      MenuEnum.CertificadosPesquisa,
      MenuEnum.DeclaracoesPesquisa,
    ]);
  });

  it('deve omitir CODAF Suplementar quando a feature flag estiver desabilitada', () => {
    const menu = criarMenuFormacoes(false);
    const keys = menu.children?.map((item) => item.key);

    expect(keys).toEqual([
      MenuEnum.Inscricoes,
      MenuEnum.ListaPresencaCodaf,
      MenuEnum.CertificadosPesquisa,
      MenuEnum.DeclaracoesPesquisa,
    ]);
  });

  it('deve incluir CODAF Formações de Conferência no submenu Lista de Presença CODAF com rota e permissões corretas', () => {
    const listaPresencaCodaf = MENU_FORMACOES.children?.find(
      (item) => item.key === MenuEnum.ListaPresencaCodaf,
    );

    expect(listaPresencaCodaf).toBeDefined();

    const codafConferencia = listaPresencaCodaf?.children?.find(
      (item) => item.key === MenuEnum.CodafFormacoesConferencia,
    );

    expect(codafConferencia).toBeDefined();
    expect(codafConferencia?.url).toBe(ROUTES.CODAF_CONFERENCIA);
    expect(codafConferencia?.roles).toEqual({
      podeConsultar: PermissaoEnum.Inscricao_C,
      podeIncluir: PermissaoEnum.Inscricao_I,
      podeExcluir: PermissaoEnum.Inscricao_E,
      podeAlterar: PermissaoEnum.Inscricao_A,
    });

    const { container } = render(<>{codafConferencia?.title}</>);
    expect(container.textContent).toContain('CODAF Formações');
    expect(container.textContent).toContain('de Conferência');
  });
});
