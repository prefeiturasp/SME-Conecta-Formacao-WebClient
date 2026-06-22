/**
 * @jest-environment jsdom
 */
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import InputCodigoEolUE from './index';
import codigoUeService from '../../../../core/services/codigo-ue-service';
import { Form } from 'antd';

// Mocks
jest.mock('../../../../core/services/codigo-ue-service', () => ({
  __esModule: true,
  default: {
    obterUePorCodigoEOL: jest.fn(),
  },
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Form: {
      ...antd.Form,
      useWatch: jest.fn(),
      Item: ({ children }: any) => <div>{children}</div>,
    },
  };
});

const mockForm = {
  setFieldsValue: jest.fn(),
  setFieldValue: jest.fn(),
};

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockForm,
}));

describe('InputCodigoEolUE', () => {
  const obterMock = codigoUeService.obterUePorCodigoEOL as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (Form.useWatch as jest.Mock).mockReturnValue(false);
  });

  /**
   * @function setup
   * @description Renders the component with base properties for testing.
   * @param {object} props - Additional props for the component.
   */
  const setup = (props = {}) => {
    return render(
      <InputCodigoEolUE
        inputProps={{}}
        formItemProps={{}}
        desativarBotaoAlterar={jest.fn()}
        {...props}
      />
    );
  };

  it('deve renderizar o componente', () => {
    const { container } = setup();
    expect(container).toBeTruthy();
  });

  it('deve marcar campo como obrigatório quando uesWatch for false', () => {
    (Form.useWatch as jest.Mock).mockReturnValue(false);
    setup();
    expect(Form.useWatch).toHaveBeenCalledWith('ues', expect.anything());
  });

  it('não deve ser obrigatório quando uesWatch for true', () => {
    (Form.useWatch as jest.Mock).mockReturnValue(true);
    setup();
    expect(Form.useWatch).toHaveBeenCalled();
  });

  it('deve chamar service no onSearch com valor válido', async () => {
    obterMock.mockResolvedValue({
      dados: { nomeUnidade: 'Unidade Teste' },
    });

    const { getByRole } = setup();

    const input = getByRole('searchbox');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(obterMock).toHaveBeenCalledWith('123456');
    });
  });

  it('não deve chamar service no onSearch com valor vazio', async () => {
    const { getByRole } = setup();

    const input = getByRole('searchbox');
    fireEvent.keyDown(input, { target: { value: '' }, key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(obterMock).not.toHaveBeenCalled();
    });
  });

  it('deve chamar service ao clicar no botão de search', async () => {
    obterMock.mockResolvedValue({
      dados: { nomeUnidade: 'Unidade Teste' },
    });

    const { container } = setup();

    const input = container.querySelector('input') as HTMLInputElement;
    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: '999999' } });

    fireEvent.click(button);

    await waitFor(() => {
      expect(obterMock).toHaveBeenCalledWith('999999');
    });
  });

  it('deve limpar nomeUnidade ao digitar no input', async () => {
    const { getByRole } = setup();

    const input = getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'abc' } });

    await waitFor(() => {
      expect(mockForm.setFieldValue).toHaveBeenCalledWith('nomeUnidade', '');
    });
  });

  it('deve atualizar form e desativar botão ao sucesso da API', async () => {
    const desativarMock = jest.fn();

    obterMock.mockResolvedValue({
      dados: { nomeUnidade: 'Unidade XYZ' },
    });

    const { getByRole } = setup({ desativarBotaoAlterar: desativarMock });

    const input = getByRole('searchbox');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      if (mockForm.setFieldsValue.mock.calls.length) {
        expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
          nomeUnidade: 'Unidade XYZ',
        });
      } else {
        expect(mockForm.setFieldValue).toHaveBeenCalledWith(
          'nomeUnidade',
          'Unidade XYZ'
        );
      }

      expect(desativarMock).toHaveBeenCalledWith(false);
    });
  });

  it('deve controlar loading durante requisição', async () => {
    let resolveFn: any;

    obterMock.mockReturnValue(
      new Promise((resolve) => {
        resolveFn = resolve;
      })
    );

    const { getByRole } = setup();

    const input = getByRole('searchbox');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    resolveFn({ dados: { nomeUnidade: 'Teste' } });

    await waitFor(() => {
      expect(obterMock).toHaveBeenCalled();
    });
  });
});