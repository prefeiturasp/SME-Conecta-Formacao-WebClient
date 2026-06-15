import ModalErroProposta from './index';
import { ERRO_CAMPOS_OBRIGATORIOS } from '../../../core/constants/mensagens';

describe('ModalErroProposta', () => {
  it('deve configurar as props do modal corretamente', () => {
    const closeModal = jest.fn();

    const element: any = ModalErroProposta({
      erros: ['Erro A'],
      closeModal,
    });

    expect(element.props.title).toBe(ERRO_CAMPOS_OBRIGATORIOS);
    expect(element.props.centered).toBe(true);
    expect(element.props.open).toBe(true);
    expect(element.props.width).toBe(1000);
    expect(element.props.closeIcon).toBe(true);
    expect(element.props.onOk).toBe(closeModal);
    expect(element.props.onCancel).toBe(closeModal);

    expect(element.props.cancelButtonProps).toEqual({
      style: {
        display: 'none',
      },
    });
  });

  it('deve criar um item para cada erro', () => {
    const element: any = ModalErroProposta({
      erros: ['Erro A', 'Erro B'],
      closeModal: jest.fn(),
    });

    const children = element.props.children;

    expect(children).toHaveLength(2);
  });

  it('deve numerar os erros corretamente', () => {
    const element: any = ModalErroProposta({
      erros: ['Primeiro erro', 'Segundo erro'],
      closeModal: jest.fn(),
    });

    const children = element.props.children;

    expect(children[0].props.children).toEqual([
      1,
      ' - ',
      'Primeiro erro',
    ]);

    expect(children[1].props.children).toEqual([
      2,
      ' - ',
      'Segundo erro',
    ]);
  });

  it('deve utilizar a mensagem do erro como key', () => {
    const element: any = ModalErroProposta({
      erros: ['Erro A', 'Erro B'],
      closeModal: jest.fn(),
    });

    const children = element.props.children;

    expect(children[0].key).toBe('Erro A');
    expect(children[1].key).toBe('Erro B');
  });
});