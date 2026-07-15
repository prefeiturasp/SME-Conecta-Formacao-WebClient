/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Form } from 'antd';

import { ModalAprovarRecusar } from './modal-aprovar-recusar';

import {
  aprovarConsideracoesAdminDf,
  aprovarConsideracoesPareceristas,
  recusarConsideracoesAdminDf,
  recusarConsideracoesPareceristas,
} from '../../../../../../core/services/proposta-service';

import { confirmacao } from '../../../../../../core/services/alerta-service';
import { notification } from '../../../../../../components/lib/notification';
import { useAppSelector } from '../../../../../../core/hooks/use-redux';

const mockForm = {
  getFieldsValue: jest.fn(() => ({
    situacao: 'AguardandoAnalisePeloParecerista',
    justificativa: 'Justificativa de teste',
  })),
  validateFields: jest.fn().mockResolvedValue(undefined),
  resetFields: jest.fn(),
  isFieldsTouched: jest.fn(() => false),
};

const mockFormInstance = {
  getFieldsValue: jest.fn(() => ({
    situacao: 'AguardandoAnalisePeloParecerista',
  })),
  setFieldValue: jest.fn(),
  validateFields: jest.fn().mockResolvedValue(undefined),
  resetFields: jest.fn(),
  isFieldsTouched: jest.fn(() => false),
};

jest.mock('antd', () => {
  const MockForm = ({ children }: any) => <div>{children}</div>;
  MockForm.Item = ({ children }: any) => <div>{children}</div>;

  return {
    __esModule: true,
    Form: MockForm,
    default: {
      Form: MockForm,
    },
  };
});

jest.mock('antd/es/form/Form', () => ({
  __esModule: true,
  useForm: () => [mockForm],
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => mockFormInstance,
}));

jest.mock('../../../../../../core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../../../../../../core/services/proposta-service', () => ({
  aprovarConsideracoesAdminDf: jest.fn(),
  aprovarConsideracoesPareceristas: jest.fn(),
  recusarConsideracoesAdminDf: jest.fn(),
  recusarConsideracoesPareceristas: jest.fn(),
}));

jest.mock('../../../../../../core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('../../../../../../components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

jest.mock('~/components/lib/modal', () => ({
  __esModule: true,
  default: ({ children, onCancel }: any) => (
    <div>
      <button type='button' data-testid='fechar' onClick={onCancel}>
        Fechar
      </button>
      {children}
    </div>
  ),
}));

jest.mock('./modal-aprovar-recusar-conteudo-inicial', () => ({
  ModalAprovarRecusarConteudoInicial: ({ onClickSalvar }: any) => (
    <button type='button' data-testid='salvar' onClick={onClickSalvar}>
      Salvar
    </button>
  ),
}));

describe('ModalAprovarRecusar', () => {
  const carregarDados = jest.fn();
  const fechar = jest.fn();

  const renderComponent = (props: any = {}) =>
    render(
      <Form>
        <ModalAprovarRecusar
          propostaId={10}
          onFecharButton={fechar}
          tipoJustificativa='Aprovar'
          carregarDados={carregarDados}
          {...props}
        />
      </Form>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Outro',
          },
        },
      }),
    );
    mockForm.validateFields.mockResolvedValue(undefined);
    mockFormInstance.validateFields.mockResolvedValue(undefined);
    mockForm.isFieldsTouched.mockReturnValue(false);
    mockFormInstance.isFieldsTouched.mockReturnValue(false);
  });

  it('deve renderizar modal', async () => {
    renderComponent();

    expect(await screen.findByTestId('salvar')).toBeInTheDocument();
  });

  it('deve aprovar como AdminDF', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Admin DF',
          },
        },
      }),
    );

    (aprovarConsideracoesAdminDf as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('salvar'));

    await waitFor(() => {
      expect(aprovarConsideracoesAdminDf).toHaveBeenCalledWith(
        10,
        expect.anything(),
      );
      expect(notification.success).toHaveBeenCalled();
      expect(fechar).toHaveBeenCalled();
      expect(carregarDados).toHaveBeenCalled();
    });
  });

  it('deve recusar como AdminDF', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Admin DF',
          },
        },
      }),
    );

    (recusarConsideracoesAdminDf as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderComponent({
      tipoJustificativa: 'Recusar',
    });

    fireEvent.click(screen.getByTestId('salvar'));

    await waitFor(() => {
      expect(recusarConsideracoesAdminDf).toHaveBeenCalledWith(
        10,
        expect.anything(),
      );
    });
  });

  it('deve aprovar como parecerista', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Parecerista',
          },
        },
      }),
    );

    (aprovarConsideracoesPareceristas as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('salvar'));

    await waitFor(() => {
      expect(aprovarConsideracoesPareceristas).toHaveBeenCalledWith(
        10,
        expect.anything(),
      );
    });
  });

  it('deve recusar como parecerista', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'Parecerista',
          },
        },
      }),
    );

    (recusarConsideracoesPareceristas as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderComponent({
      tipoJustificativa: 'Recusar',
    });

    fireEvent.click(screen.getByTestId('salvar'));

    await waitFor(() => {
      expect(recusarConsideracoesPareceristas).toHaveBeenCalledWith(
        10,
        expect.anything(),
      );
    });
  });

  it('deve fechar diretamente quando formulário não foi alterado', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('fechar'));

    expect(fechar).toHaveBeenCalled();
    expect(confirmacao).not.toHaveBeenCalled();
  });

  it('deve pedir confirmação quando formulário foi alterado', () => {
    mockForm.isFieldsTouched.mockReturnValue(true);

    renderComponent();

    fireEvent.click(screen.getByTestId('fechar'));

    expect(confirmacao).toHaveBeenCalled();
  });

  it('deve confirmar descarte de alteração', () => {
    mockForm.isFieldsTouched.mockReturnValue(true);
    (confirmacao as jest.Mock).mockImplementation(({ onOk }: any) => {
      onOk();
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('fechar'));

    expect(fechar).toHaveBeenCalled();
  });

  it('não deve executar ações quando API retorna erro', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      perfilNome: 'AdminDF',
    });

    (aprovarConsideracoesAdminDf as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('salvar'));

    await waitFor(() => {
      expect(notification.success).not.toHaveBeenCalled();
    });
  });
});
