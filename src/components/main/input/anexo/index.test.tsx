/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';

import InputAnexo from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // legado
    removeListener: jest.fn(), // legado
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const renderComponent = (props = {}) =>
  render(
    <Form>
      <InputAnexo
        nome="link"
        label="Anexo"
        {...props}
      />
    </Form>
  );

describe('InputAnexo', () => {
  beforeEach(() => {
    jest.spyOn(window, 'open').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve renderizar o label', () => {
    renderComponent();

    expect(screen.getByText('Anexo')).toBeInTheDocument();
  });

  it('deve renderizar o placeholder', () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      )
    ).toBeInTheDocument();
  });

  it('deve exibir tooltip quando solicitado', async () => {
    renderComponent({
      exibirTooltip: true,
      mensagemTooltip: 'Mensagem do tooltip',
    });

    fireEvent.mouseOver(
      screen.getByRole('img', { hidden: true })
    );

    expect(
      await screen.findByText('Mensagem do tooltip')
    ).toBeInTheDocument();
  });

  it('não deve renderizar tooltip por padrão', () => {
    renderComponent();

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('deve renderizar input desabilitado', () => {
    renderComponent({
      disabled: true,
    });

    expect(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      )
    ).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'Abrir link' })
    ).toBeDisabled();
  });

  it('deve habilitar o botão para uma URL válida', async () => {
    renderComponent();

    fireEvent.change(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      ),
      {
        target: {
          value: 'https://google.com',
        },
      }
    );

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: 'Abrir link',
        })
      ).toBeEnabled()
    );
  });

  it('deve abrir o link ao clicar no botão', async () => {
    renderComponent();

    fireEvent.change(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      ),
      {
        target: {
          value: 'https://google.com',
        },
      }
    );

    const button = await screen.findByRole('button', {
      name: 'Abrir link',
    });

    fireEvent.click(button);

    expect(window.open).toHaveBeenCalledWith(
      'https://google.com',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('não deve abrir link inválido', async () => {
    renderComponent();

    fireEvent.change(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      ),
      {
        target: {
          value: 'google.com',
        },
      }
    );

    const button = screen.getByRole('button', {
      name: 'Abrir link',
    });

    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(window.open).not.toHaveBeenCalled();
  });

  it('deve exibir mensagem de erro padrão', async () => {
    renderComponent();

    fireEvent.change(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      ),
      {
        target: {
          value: 'abc',
        },
      }
    );

    fireEvent.blur(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      )
    );

    expect(
      await screen.findByText(
        'O link inserido é inválido.'
      )
    ).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro personalizada', async () => {
    renderComponent({
      mensagemErro: 'URL inválida',
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      ),
      {
        target: {
          value: 'abc',
        },
      }
    );

    fireEvent.blur(
      screen.getByPlaceholderText(
        'Insira o link de acesso aos documentos'
      )
    );

    expect(
      await screen.findByText('URL inválida')
    ).toBeInTheDocument();
  });
});