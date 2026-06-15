import NotificationStorage, {
  openNotificationErrors,
} from './index';

const errorMock = jest.fn();

jest.mock('antd', () => ({
  App: {
    useApp: jest.fn(() => ({
      notification: {
        error: errorMock,
      },
    })),
  },
}));

describe('NotificationStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar a instância de notification', () => {
    const result = NotificationStorage();

    expect(result).toBeNull();
  });

  it('deve exibir uma notificação para cada mensagem', () => {
    NotificationStorage();

    openNotificationErrors([
      'Erro 1',
      'Erro 2',
    ]);

    expect(errorMock).toHaveBeenCalledTimes(2);

    expect(errorMock).toHaveBeenNthCalledWith(1, {
      message: 'Erro',
      description: 'Erro 1',
    });

    expect(errorMock).toHaveBeenNthCalledWith(2, {
      message: 'Erro',
      description: 'Erro 2',
    });
  });

  it('não deve exibir notificações quando a lista estiver vazia', () => {
    NotificationStorage();

    openNotificationErrors([]);

    expect(errorMock).not.toHaveBeenCalled();
  });

  it('não deve exibir notificações quando mensagens for undefined', () => {
    NotificationStorage();

    openNotificationErrors(undefined as any);

    expect(errorMock).not.toHaveBeenCalled();
  });
});