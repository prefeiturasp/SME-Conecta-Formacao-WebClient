import React from 'react';
import Modal from './index';

jest.mock('styled-components', () => {
  const styled = () => () => 'mocked-component';

  return {
    __esModule: true,
    default: styled,
  };
});

jest.mock('antd', () => ({
  Modal: 'antd-modal',
}));

describe('Modal', () => {
  it('deve criar o componente com cancelText padrão', () => {
    const element: any = Modal({ open: true });

    expect(element.props.cancelText).toBe('Cancelar');
  });

  it('deve definir okButtonProps.type como default', () => {
    const element: any = Modal({ open: true });

    expect(element.props.okButtonProps).toEqual({
      type: 'default',
    });
  });

  it('deve preservar propriedades de okButtonProps', () => {
    const element: any = Modal({
      open: true,
      okButtonProps: {
        disabled: true,
      },
    });

    expect(element.props.okButtonProps).toEqual({
      disabled: true,
      type: 'default',
    });
  });

  it('deve definir cancelButtonProps.type como text', () => {
    const element: any = Modal({ open: true });

    expect(element.props.cancelButtonProps.type).toBe('text');
  });

  it('deve manter o tipo informado', () => {
    const element: any = Modal({
      open: true,
      cancelButtonProps: {
        type: 'primary',
      },
    });

    expect(element.props.cancelButtonProps.type).toBe('primary');
  });

  it('deve preservar o style informado', () => {
    const element: any = Modal({
      open: true,
      cancelButtonProps: {
        style: {
          width: 120,
        },
      },
    });

    expect(element.props.cancelButtonProps.style).toEqual({
      width: 120,
    });
  });

  it('deve repassar outras props', () => {
    const element: any = Modal({
      open: true,
      title: 'Meu Modal',
    });

    expect(element.props.open).toBe(true);
    expect(element.props.title).toBe('Meu Modal');
  });
});