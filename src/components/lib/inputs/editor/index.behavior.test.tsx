/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import JoditEditorSME from './index';

let handlers: Record<string, any> = {};
let instanciaAtual: any;
let configAtual: any;

jest.mock('./include.jodit', () => {
  const Jodit = {
    make: jest.fn((element: any, config: any) => {
      configAtual = config;
      handlers = {};
      instanciaAtual = {
        value: '',
        text: '',
        destruct: jest.fn(),
        workplace: { tabIndex: 0 },
        editorDocument: {
          getElementsByClassName: jest.fn(() => [
            {
              translate: true,
              className: 'jodit',
              getElementsByTagName: jest.fn(() => [{ children: [] }]),
            },
          ]),
          querySelectorAll: jest.fn(() => []),
        },
        selection: {
          insertHTML: jest.fn(),
          setCursorIn: jest.fn(),
        },
        events: {
          on: jest.fn(function (event: string, fn: any) {
            handlers[event] = fn;
            return this;
          }),
          off: jest.fn(function () {
            return this;
          }),
        },
        message: {
          error: jest.fn(),
        },
      };

      return instanciaAtual;
    }),
    modules: {
      Helpers: {
        isFunction: (fn: any) => typeof fn === 'function',
      },
    },
    atom: jest.fn((val: any) => val),
    defaultOptions: {
      popup: {
        img: [{ name: 'pencil' }, { name: 'valign' }, { name: 'other' }],
      },
    },
  };

  return { Jodit };
});

describe('JoditEditorSME behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve chamar onBlur com valor atual do editor', () => {
    const onBlur = jest.fn();

    render(<JoditEditorSME value='<p>inicial</p>' onBlur={onBlur} onChange={jest.fn()} />);

    instanciaAtual.value = '<p>valor-final</p>';
    handlers.blur();

    expect(onBlur).toHaveBeenCalledWith('<p>valor-final</p>');
  });

  test('deve usar oldValue no onChange quando novo valor contém SVG', () => {
    const onChange = jest.fn();
    const erro = jest.fn();

    render(<JoditEditorSME value='<p>inicial</p>' onBlur={jest.fn()} onChange={onChange} erro={erro} />);

    instanciaAtual.text = 'conteudo-valido';
    handlers.change('<svg><circle /></svg>', '<p>old</p>');

    expect(erro).toHaveBeenCalledWith('Não é possivel inserir código HTML com SVG.');
    expect(onChange).toHaveBeenCalledWith('<p>old</p>');
  });

  test('deve bloquear inserção de arquivo quando permiteInserirArquivo=false', () => {
    const onChange = jest.fn();
    const erro = jest.fn();

    render(
      <JoditEditorSME
        value='<p>inicial</p>'
        onBlur={jest.fn()}
        onChange={onChange}
        erro={erro}
        permiteInserirArquivo={false}
      />,
    );

    instanciaAtual.text = 'conteudo-valido';
    handlers.change('<img src="arquivo.png" />', '<p>old</p>');

    expect(erro).toHaveBeenCalledWith('Não é possível inserir arquivo');
    expect(onChange).toHaveBeenCalledWith('<p>old</p>');
  });

  test('uploader buildData deve rejeitar formato inválido', async () => {
    const erro = jest.fn();

    render(
      <JoditEditorSME
        value=''
        onBlur={jest.fn()}
        onChange={jest.fn()}
        erro={erro}
        permiteInserirArquivo
        config={{
          uploader: {
            url: '/upload',
            headers: { Authorization: 'token' },
            imagesExtensions: ['jpg', 'jpeg', 'png'],
          },
        }}
      />,
    );

    const fileInvalido = { size: 1024, type: 'application/pdf' } as File;
    const formData = {
      getAll: jest.fn(() => [fileInvalido]),
    } as any;

    await expect(configAtual.uploader.buildData(formData)).rejects.toBeUndefined();
    expect(erro).toHaveBeenCalledWith('O formato .pdf não é valido.');
  });

  test('uploader buildData deve resolver para imagem válida', async () => {
    render(
      <JoditEditorSME
        value=''
        onBlur={jest.fn()}
        onChange={jest.fn()}
        permiteInserirArquivo
        config={{
          uploader: {
            url: '/upload',
            headers: { Authorization: 'token' },
            imagesExtensions: ['jpg', 'jpeg', 'png'],
          },
        }}
      />,
    );

    const fileValido = { size: 1024, type: 'image/png' } as File;
    const formData = {
      getAll: jest.fn(() => [fileValido]),
    } as any;

    await expect(configAtual.uploader.buildData(formData)).resolves.toBe(formData);
  });
});
