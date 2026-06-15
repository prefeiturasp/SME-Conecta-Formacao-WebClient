/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { permiteInserirFormato } from './index';
import UploadArquivosSME from './index';
import { render } from '@testing-library/react';

jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const setFieldValueMock = jest.fn();

const useWatchMock = jest.fn();

jest.mock('antd', () => {
  return {
    Form: {
      Item: ({ children }: any) => <div>{children}</div>,
      useWatch: (...args: any[]) => useWatchMock(...args),
    },
    Upload: {
      Dragger: (props: any) => {
        (globalThis as any).__draggerProps = props;
        return <div data-testid="dragger">{props.children}</div>;
      },
    },
  };
});

describe('permiteInserirFormato', () => {
  it('deve retornar true quando não houver restrição', () => {
    const resultado = permiteInserirFormato(
      { name: 'arquivo.pdf' },
      '',
    );

    expect(resultado).toBe(true);
  });

  it('deve permitir formato válido', () => {
    const resultado = permiteInserirFormato(
      { name: 'arquivo.pdf' },
      '.pdf,.doc',
    );

    expect(resultado).toBe(true);
  });

  it('deve bloquear formato inválido', () => {
    const resultado = permiteInserirFormato(
      { name: 'arquivo.exe' },
      '.pdf,.doc',
    );

    expect(resultado).toBe(false);
  });
});

describe('UploadArquivosSME', () => {
  const uploadServiceMock = jest.fn();
  const downloadServiceMock = jest.fn();

  const formMock = {
    setFieldValue: setFieldValueMock,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    useWatchMock.mockReturnValue([]);
  });

  const renderComponent = () =>
    render(
      <UploadArquivosSME
        form={formMock}
        formItemProps={{
          name: 'arquivos',
          label: 'Arquivos',
        }}
        uploadService={uploadServiceMock}
        downloadService={downloadServiceMock}
      />,
    );

  it('deve renderizar componente', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('dragger')).toBeTruthy();
  });

  it('deve definir beforeUpload', () => {
    renderComponent();

    expect(
      (globalThis as any).__draggerProps.beforeUpload,
    ).toBeDefined();
  });

  it('deve definir customRequest', () => {
    renderComponent();

    expect(
      (globalThis as any).__draggerProps.customRequest,
    ).toBeDefined();
  });

  it('deve definir onChange', () => {
    renderComponent();

    expect(
      (globalThis as any).__draggerProps.onChange,
    ).toBeDefined();
  });

  it('deve definir onDownload', () => {
    renderComponent();

    expect(
      (globalThis as any).__draggerProps.onDownload,
    ).toBeDefined();
  });

  it('deve definir onRemove', () => {
    renderComponent();

    expect(
      (globalThis as any).__draggerProps.onRemove,
    ).toBeDefined();
  });

  it('deve aceitar upload válido', () => {
    renderComponent();

    const beforeUpload =
      (globalThis as any).__draggerProps.beforeUpload;

    const resultado = beforeUpload({
      name: 'arquivo.pdf',
      size: 1024,
    });

    expect(resultado).toBe(true);
  });

  it('deve atualizar campo quando upload finalizar', () => {
    renderComponent();

    const onChange =
      (globalThis as any).__draggerProps.onChange;

    onChange({
      file: {
        uid: '1',
        status: 'done',
      },
      fileList: [
        {
          uid: '1',
          status: 'done',
        },
      ],
    });

    expect(setFieldValueMock).toHaveBeenCalled();
  });

  it('deve remover arquivo da lista quando ocorrer erro', () => {
    renderComponent();

    const onChange =
      (globalThis as any).__draggerProps.onChange;

    onChange({
      file: {
        uid: '1',
        status: 'error',
      },
      fileList: [
        {
          uid: '1',
          status: 'error',
        },
      ],
    });

    expect(setFieldValueMock).toHaveBeenCalled();
  });

  it('deve permitir remoção de arquivo enviado', async () => {
    renderComponent();

    const onRemove =
      (globalThis as any).__draggerProps.onRemove;

    const resultado = await onRemove({
      name: 'arquivo.pdf',
      xhr: 'codigo',
    });

    expect(resultado).toBe(true);
  });

  it('deve bloquear remoção sem xhr', async () => {
    renderComponent();

    const onRemove =
      (globalThis as any).__draggerProps.onRemove;

    const resultado = await onRemove({
      name: 'arquivo.pdf',
    });

    expect(resultado).toBe(false);
  });

  it('deve executar download', async () => {
    downloadServiceMock.mockResolvedValue({
      data: 'conteudo',
    });

    globalThis.URL.createObjectURL = jest.fn(() => 'blob:url');
    globalThis.URL.revokeObjectURL = jest.fn();

    renderComponent();

    const onDownload =
      (globalThis as any).__draggerProps.onDownload;

    await onDownload({
      xhr: '123',
      name: 'arquivo.pdf',
    });

    expect(downloadServiceMock).toHaveBeenCalledWith('123');
  });

  it('deve executar upload com sucesso', async () => {
    uploadServiceMock.mockResolvedValue({
      data: {
        codigo: '123',
        id: 1,
      },
    });

    renderComponent();

    const customRequest =
      (globalThis as any).__draggerProps.customRequest;

    const onSuccess = jest.fn();

    await customRequest({
      file: new File(['abc'], 'teste.pdf'),
      onSuccess,
      onError: jest.fn(),
      onProgress: jest.fn(),
    });

    expect(uploadServiceMock).toHaveBeenCalled();
  });
});