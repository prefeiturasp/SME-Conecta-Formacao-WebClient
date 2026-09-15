/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import React from 'react';

import { ModalEditNomeSocialButton } from './modal-edit-nome-social-button';

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

type ModalMockProps = {
  updateFields: (values: { nomeSocial: string }) => void;
  initialValues: { nomeSocial: string };
  closeModal: () => void;
};

let capturedModalProps: ModalMockProps | undefined;

jest.mock('./modal-edit-nome-social', () => ({
  ModalEditNomeSocial: (props: ModalMockProps) => {
    capturedModalProps = props;
    return <div data-testid='modal-edit-nome-social' />;
  },
}));

describe('ModalEditNomeSocialButton', () => {
  beforeEach(() => {
    capturedModalProps = undefined;
  });

  const Wrapper = ({ nomeSocial }: { nomeSocial?: string } = {}) => {
    const [formPreview] = Form.useForm<{ nomeSocial: string }>();

    React.useEffect(() => {
      formPreview.setFieldsValue({ nomeSocial });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Form form={formPreview}>
        <Form.Item name='nomeSocial' hidden>
          <input />
        </Form.Item>
        <ModalEditNomeSocialButton formPreview={formPreview} />
      </Form>
    );
  };

  it('exibe o texto Adicionar quando não há nome social', () => {
    render(<Wrapper />);

    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  it('exibe o texto Alterar quando já existe nome social', async () => {
    render(<Wrapper nomeSocial='Maria' />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Alterar' })).toBeInTheDocument();
    });
  });

  it('não exibe o modal antes de clicar no botão', () => {
    render(<Wrapper />);

    expect(screen.queryByTestId('modal-edit-nome-social')).not.toBeInTheDocument();
  });

  it('exibe o modal ao clicar no botão', () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(screen.getByTestId('modal-edit-nome-social')).toBeInTheDocument();
  });

  it('fecha o modal ao chamar closeModal', async () => {
    render(<Wrapper />);

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));
    expect(screen.getByTestId('modal-edit-nome-social')).toBeInTheDocument();

    act(() => {
      capturedModalProps?.closeModal();
    });

    expect(screen.queryByTestId('modal-edit-nome-social')).not.toBeInTheDocument();
  });

  it('atualiza o campo nomeSocial do formPreview ao chamar updateFields', () => {
    let formPreviewRef: ReturnType<typeof Form.useForm<{ nomeSocial: string }>>[0] | undefined;

    const WrapperComRef = () => {
      const [formPreview] = Form.useForm<{ nomeSocial: string }>();
      formPreviewRef = formPreview;

      return (
        <Form form={formPreview}>
          <ModalEditNomeSocialButton formPreview={formPreview} />
        </Form>
      );
    };

    render(<WrapperComRef />);

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));

    capturedModalProps?.updateFields({ nomeSocial: 'Novo Nome' });

    expect(formPreviewRef?.getFieldValue('nomeSocial')).toBe('Novo Nome');
  });
});
