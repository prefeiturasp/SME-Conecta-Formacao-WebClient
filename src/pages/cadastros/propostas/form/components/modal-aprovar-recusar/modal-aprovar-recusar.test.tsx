/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { ModalAprovarRecusar } from './modal-aprovar-recusar';
import { confirmacao } from '../../../../../../core/services/alerta-service';
import * as propostaService from '../../../../../../core/services/proposta-service';

jest.mock('antd', () => {

  return {
    Form: Object.assign(({ children }: any) => <div>{children}</div>, {
      useForm: () => [
        {
          getFieldsValue: () => ({ situacao: 'qualquer' }),
          isFieldsTouched: () => true,
          validateFields: () => Promise.resolve({}),
          resetFields: jest.fn(),
        },
      ],
    }),
  };
});

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => ({
    getFieldsValue: () => ({ situacao: 'qualquer' }),
    isFieldsTouched: () => true,
    validateFields: () => Promise.resolve({}),
    resetFields: jest.fn(),
  }),
}));

jest.mock('~/components/lib/modal', () => ({
  __esModule: true,
  default: ({ children, onCancel }: any) => (
    <div>
      <button data-testid="close" onClick={onCancel}>
        close
      </button>
      {children}
    </div>
  ),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: () => ({
    perfilNome: 'AdminDF',
  }),
}));

jest.mock('~/core/enum/tipo-perfil', () => ({
  TipoPerfilEnum: {
    AdminDF: 'AdminDF',
  },
  TipoPerfilTagDisplay: {
    AdminDF: 'AdminDF',
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn((config: any) => {
    if (config && typeof config.onOk === 'function') {
      config.onOk();
    }
  }),
}));

jest.mock('~/core/services/proposta-service', () => ({
  aprovarConsideracoesAdminDf: jest.fn(() =>
    Promise.resolve({ sucesso: true }),
  ),
  recusarConsideracoesAdminDf: jest.fn(() =>
    Promise.resolve({ sucesso: true }),
  ),
  aprovarConsideracoesPareceristas: jest.fn(() =>
    Promise.resolve({ sucesso: true }),
  ),
  recusarConsideracoesPareceristas: jest.fn(() =>
    Promise.resolve({ sucesso: true }),
  ),
}));

jest.mock('./modal-aprovar-recusar-conteudo-inicial', () => ({
  ModalAprovarRecusarConteudoInicial: ({ onClickSalvar }: any) => (
    <button data-testid="conteudo" onClick={onClickSalvar}>
      salvar
    </button>
  ),
}));

const defaultProps = {
  propostaId: 1,
  onFecharButton: jest.fn(),
  tipoJustificativa: 'Aprovar',
  carregarDados: jest.fn(),
};

describe('ModalAprovarRecusar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar componente corretamente', async () => {
    const { findByTestId } = render(
      <ModalAprovarRecusar {...defaultProps} />,
    );

    expect(await findByTestId('conteudo')).toBeInTheDocument();
  });

  it('deve chamar fluxo de validação ao salvar', async () => {
    const { getByTestId } = render(
      <ModalAprovarRecusar {...defaultProps} />,
    );

    fireEvent.click(getByTestId('conteudo'));

    await waitFor(() => {
      expect(propostaService.aprovarConsideracoesAdminDf).toHaveBeenCalled();
    });
  });

  it('deve fechar modal ao clicar em fechar', () => {
    const props = {
      ...defaultProps,
      onFecharButton: jest.fn(),
    };

    const { getByTestId } = render(
      <ModalAprovarRecusar {...props} />,
    );

    fireEvent.click(getByTestId('close'));

    expect(props.onFecharButton).toHaveBeenCalled();
  });

  it('deve abrir confirmação quando form foi tocado', () => {
    const { getByTestId } = render(
      <ModalAprovarRecusar {...defaultProps} />,
    );

    fireEvent.click(getByTestId('close'));

    expect(confirmacao).toHaveBeenCalled();
  });
});