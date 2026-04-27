import { confirmacao, sucesso } from './alerta-service';

jest.mock('antd', () => ({
  Modal: {
    confirm: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    Neutral: { DARK: '#42474A' },
    SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } },
  },
}));

import { Modal } from 'antd';

describe('alerta-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('confirmacao', () => {
    it('calls Modal.confirm', () => {
      confirmacao({ content: 'Deseja confirmar?' });
      expect(Modal.confirm).toHaveBeenCalledTimes(1);
    });

    it('uses default title "Atenção" when not provided', () => {
      confirmacao({ content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.title).toBe('Atenção');
    });

    it('uses provided title', () => {
      confirmacao({ title: 'Titulo custom', content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.title).toBe('Titulo custom');
    });

    it('uses default okText "Sim" when not provided', () => {
      confirmacao({ content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.okText).toBe('Sim');
    });

    it('uses provided okText', () => {
      confirmacao({ content: 'Mensagem', okText: 'Confirmar' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.okText).toBe('Confirmar');
    });

    it('uses default cancelText "Não" when not provided', () => {
      confirmacao({ content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.cancelText).toBe('Não');
    });

    it('uses provided cancelText', () => {
      confirmacao({ content: 'Mensagem', cancelText: 'Voltar' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.cancelText).toBe('Voltar');
    });

    it('sets icon to null', () => {
      confirmacao({ content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.icon).toBeNull();
    });

    it('sets width to 500', () => {
      confirmacao({ content: 'Mensagem' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.width).toBe(500);
    });

    it('passes content', () => {
      confirmacao({ content: 'Conteúdo da confirmação' });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.content).toBe('Conteúdo da confirmação');
    });

    it('passes onOk callback', () => {
      const onOk = jest.fn();
      confirmacao({ content: 'Mensagem', onOk });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.onOk).toBe(onOk);
    });

    it('passes onCancel callback', () => {
      const onCancel = jest.fn();
      confirmacao({ content: 'Mensagem', onCancel });
      const call = (Modal.confirm as jest.Mock).mock.calls[0][0];
      expect(call.onCancel).toBe(onCancel);
    });
  });

  describe('sucesso', () => {
    it('calls Modal.success', () => {
      sucesso({ content: 'Operação realizada!' });
      expect(Modal.success).toHaveBeenCalledTimes(1);
    });

    it('uses default okText "Sim" when not provided', () => {
      sucesso({ content: 'Mensagem' });
      const call = (Modal.success as jest.Mock).mock.calls[0][0];
      expect(call.okText).toBe('Sim');
    });

    it('uses provided okText', () => {
      sucesso({ content: 'Mensagem', okText: 'OK' });
      const call = (Modal.success as jest.Mock).mock.calls[0][0];
      expect(call.okText).toBe('OK');
    });

    it('passes content', () => {
      sucesso({ content: 'Sucesso na operação' });
      const call = (Modal.success as jest.Mock).mock.calls[0][0];
      expect(call.content).toBe('Sucesso na operação');
    });
  });
});
