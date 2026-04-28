/**
 * @jest-environment jsdom
 */
import { onClickCancelar, onClickExcluir, onClickVoltar } from './index';

import { confirmacao } from '~/core/services/alerta-service';
import { notification } from '~/components/lib/notification';

// mocks
jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

describe('form utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- CANCELAR ----------------

  it('should call confirmacao when form is touched (cancelar)', () => {
    const resetFields = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      resetFields,
    } as any;

    onClickCancelar({ form: formMock });

    expect(confirmacao).toHaveBeenCalled();
  });

  it('should reset fields when confirmacao onOk is triggered', () => {
    const resetFields = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      resetFields,
    } as any;

    onClickCancelar({ form: formMock });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];
    config.onOk();

    expect(resetFields).toHaveBeenCalled();
  });

  it('should NOT call confirmacao when form is not touched', () => {
    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(false),
    } as any;

    onClickCancelar({ form: formMock });

    expect(confirmacao).not.toHaveBeenCalled();
  });

  // ---------------- VOLTAR ----------------

  it('should navigate directly when form is not touched', () => {
    const navigate = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(false),
    } as any;

    onClickVoltar({
      form: formMock,
      route: '/home',
      navigate,
    });

    expect(navigate).toHaveBeenCalledWith('/home', undefined);
  });

  it('should open confirmacao when form is touched', () => {
    const navigate = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      submit: jest.fn(),
    } as any;

    onClickVoltar({
      form: formMock,
      route: '/home',
      navigate,
    });

    expect(confirmacao).toHaveBeenCalled();
  });

  it('should submit form on onOk (default behavior)', () => {
    const navigate = jest.fn();
    const submit = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      submit,
    } as any;

    onClickVoltar({
      form: formMock,
      route: '/home',
      navigate,
    });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];
    config.onOk();

    expect(submit).toHaveBeenCalled();
  });

  it('should navigate on onCancel (default behavior)', () => {
    const navigate = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      submit: jest.fn(),
    } as any;

    onClickVoltar({
      form: formMock,
      route: '/home',
      navigate,
    });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];
    config.onCancel();

    expect(navigate).toHaveBeenCalledWith('/home', undefined);
  });

  it('should invert behavior when inverterOnOkCancel = true', () => {
    const navigate = jest.fn();
    const submit = jest.fn();

    const formMock = {
      isFieldsTouched: jest.fn().mockReturnValue(true),
      submit,
    } as any;

    onClickVoltar({
      form: formMock,
      route: '/home',
      navigate,
      inverterOnOkCancel: true,
    });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];

    config.onOk();
    expect(navigate).toHaveBeenCalled();

    config.onCancel();
    expect(submit).toHaveBeenCalled();
  });

  // ---------------- EXCLUIR ----------------

  it('should call confirmacao when id and endpoint exist', () => {
    const endpointExcluir = jest.fn().mockResolvedValue({ sucesso: true });

    onClickExcluir({
      id: 1,
      endpointExcluir,
    });

    expect(confirmacao).toHaveBeenCalled();
  });

  it('should call endpointExcluir and show success notification', async () => {
    const endpointExcluir = jest.fn().mockResolvedValue({ sucesso: true });
    const navigate = jest.fn();

    onClickExcluir({
      id: 1,
      endpointExcluir,
      navigate,
      route: '/home',
    });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];

    await config.onOk();

    expect(endpointExcluir).toHaveBeenCalledWith(1);
    expect(notification.success).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/home', undefined);
  });

  it('should NOT navigate if response is not sucesso', async () => {
    const endpointExcluir = jest.fn().mockResolvedValue({ sucesso: false });
    const navigate = jest.fn();

    onClickExcluir({
      id: 1,
      endpointExcluir,
      navigate,
      route: '/home',
    });

    const config = (confirmacao as jest.Mock).mock.calls[0][0];

    await config.onOk();

    expect(notification.success).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should NOT call confirmacao if id is missing', () => {
    onClickExcluir({
      endpointExcluir: jest.fn(),
    });

    expect(confirmacao).not.toHaveBeenCalled();
  });
});