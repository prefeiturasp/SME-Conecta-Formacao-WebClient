/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ModalEditNomeSocial } from './modal-edit-nome-social';
import { useAppSelector } from '../../../../core/hooks/use-redux';
import usuarioService from '../../../../core/services/usuario-service';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('antd/es/form/Form', () => {
  const actual = jest.requireActual('antd');
  return { useForm: actual.Form.useForm };
});

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarNomeSocial: jest.fn(),
  },
}));

type ModalEditDefaultMockProps = {
  title: React.ReactNode;
  service: (values: any) => Promise<any>;
  adicionar: boolean;
  updateFields: (values: any) => void;
  mensagemConfirmarCancelar: string;
  closeModal: () => void;
  children: React.ReactNode;
};

let capturedDefaultProps: ModalEditDefaultMockProps | undefined;

jest.mock('../modal-edit-default', () => ({
  __esModule: true,
  default: (props: ModalEditDefaultMockProps) => {
    capturedDefaultProps = props;
    return (
      <div data-testid='modal-edit-default'>
        <h2>{props.title}</h2>
        {props.children}
      </div>
    );
  },
}));

const useAppSelectorMock = useAppSelector as unknown as jest.Mock;

describe('ModalEditNomeSocial', () => {
  const updateFields = jest.fn();
  const closeModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    capturedDefaultProps = undefined;
    useAppSelectorMock.mockImplementation((selector: any) =>
      selector({ auth: { usuarioLogin: 'usuario.teste' } }),
    );
  });

  const renderizar = (initialValues: { nomeSocial: string }) =>
    render(
      <ModalEditNomeSocial
        initialValues={initialValues}
        updateFields={updateFields}
        closeModal={closeModal}
      />,
    );

  it('exibe o título "Adicionar nome social" quando não há nome social inicial', () => {
    renderizar({ nomeSocial: '' });

    expect(screen.getByText('Adicionar nome social')).toBeInTheDocument();
    expect(capturedDefaultProps?.adicionar).toBe(true);
  });

  it('exibe o título "Alterar nome social" quando já existe nome social inicial', () => {
    renderizar({ nomeSocial: 'Maria' });

    expect(screen.getByText('Alterar nome social')).toBeInTheDocument();
    expect(capturedDefaultProps?.adicionar).toBe(false);
  });

  it('renderiza o campo de nome social com o valor inicial', () => {
    renderizar({ nomeSocial: 'Maria' });

    expect(screen.getByPlaceholderText('Exemplo: João da Silva')).toHaveValue('Maria');
  });

  it('remove caracteres não alfabéticos ao digitar', () => {
    renderizar({ nomeSocial: '' });

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    fireEvent.change(input, { target: { value: 'Ma1ria2' } });

    expect(input).toHaveValue('Maria');
  });

  it('repassa closeModal e updateFields para o ModalEditDefault', () => {
    renderizar({ nomeSocial: '' });

    expect(capturedDefaultProps?.closeModal).toBe(closeModal);
    expect(capturedDefaultProps?.updateFields).toBe(updateFields);
    expect(capturedDefaultProps?.mensagemConfirmarCancelar).toBe(
      'Você não salvou o novo nome social, confirma que deseja descartar a alteração?',
    );
  });

  it('chama usuarioService.alterarNomeSocial com o login do usuário logado e o novo nome', async () => {
    (usuarioService.alterarNomeSocial as jest.Mock).mockResolvedValue({ data: true });

    renderizar({ nomeSocial: '' });

    await capturedDefaultProps?.service({ nomeSocial: 'Novo Nome' });

    expect(usuarioService.alterarNomeSocial).toHaveBeenCalledWith('usuario.teste', 'Novo Nome');
  });
});
