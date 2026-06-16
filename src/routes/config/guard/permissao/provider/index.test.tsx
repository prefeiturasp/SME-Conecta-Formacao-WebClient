/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import PermissaoContextProvider, { PermissaoContext } from './index';
import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;

const renderHookConsumer = (menu: any) => {
  let contextValue: any;

  render(
    <PermissaoContextProvider menu={menu}>
      <PermissaoContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </PermissaoContext.Consumer>
    </PermissaoContextProvider>,
  );

  return () => contextValue;
};

describe('PermissaoContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve aplicar somenteConsulta como true quando informado', () => {
    mockUseParams.mockReturnValue({ id: undefined });

    const menu = {
      permissao: {
        somenteConsulta: true,
        podeAlterar: true,
        podeIncluir: true,
      },
    };

    const getValue = renderHookConsumer(menu);

    expect(getValue().desabilitarCampos).toBe(true);
  });

  it('deve desabilitar campos quando id > 0 e podeAlterar = false', () => {
    mockUseParams.mockReturnValue({ id: '10' });

    const menu = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: false,
        podeIncluir: true,
      },
    };

    const getValue = renderHookConsumer(menu);

    expect(getValue().desabilitarCampos).toBe(true);
  });

  it('não deve desabilitar campos quando id > 0 e podeAlterar = true', () => {
    mockUseParams.mockReturnValue({ id: '10' });

    const menu = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: true,
        podeIncluir: false,
      },
    };

    const getValue = renderHookConsumer(menu);

    expect(getValue().desabilitarCampos).toBe(false);
  });

  it('deve desabilitar campos quando id = 0 e podeIncluir = false', () => {
    mockUseParams.mockReturnValue({ id: undefined });

    const menu = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: true,
        podeIncluir: false,
      },
    };

    const getValue = renderHookConsumer(menu);

    expect(getValue().desabilitarCampos).toBe(true);
  });

  it('não deve desabilitar campos quando id = 0 e podeIncluir = true', () => {
    mockUseParams.mockReturnValue({ id: undefined });

    const menu = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: false,
        podeIncluir: true,
      },
    };

    const getValue = renderHookConsumer(menu);

    expect(getValue().desabilitarCampos).toBe(false);
  });

  it('deve atualizar estado quando menu muda', () => {
    mockUseParams.mockReturnValue({ id: '1' });

    const menuInicial = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: false,
        podeIncluir: true,
      },
    };

    const menuNovo = {
      permissao: {
        somenteConsulta: false,
        podeAlterar: true,
        podeIncluir: true,
      },
    };

    let contextValue: any;

    const { rerender } = render(
      <PermissaoContextProvider menu={menuInicial}>
        <PermissaoContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </PermissaoContext.Consumer>
      </PermissaoContextProvider>,
    );

    expect(contextValue.desabilitarCampos).toBe(true);

    rerender(
      <PermissaoContextProvider menu={menuNovo}>
        <PermissaoContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </PermissaoContext.Consumer>
      </PermissaoContextProvider>,
    );

    expect(contextValue.desabilitarCampos).toBe(false);
  });
});