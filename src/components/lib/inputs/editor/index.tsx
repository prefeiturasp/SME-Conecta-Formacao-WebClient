import { Jodit as JoditType } from 'jodit/types/jodit';
import { BuildDataResult, IUploaderAnswer } from 'jodit/types/types/uploader';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

import styled from 'styled-components';
import { Jodit } from './include.jodit';
import { IJoditEditorProps } from './index-types';

type EditorContainerPros = {
  hasError?: boolean;
};
const EditorContainer = styled.div<EditorContainerPros>`
  .jodit-container {
    border-color: ${(props) =>
      props?.hasError ? props.theme?.antd?.colorError : '#dadada'} !important;
  }

  .jodit-status-bar-link {
    display: none;
  }
`;

const { isFunction } = Jodit.modules.Helpers;

type ArquivoEditorDto = {
  files: string[];
  baseUrl: string;
  message: string;
  error: string;
  path: string;
  contentType: string;
};

type RetornoArquivoEditorDto = {
  data: ArquivoEditorDto;
  success: boolean;
};

const BYTES_OF_ONE_MB = 1048576; // 1 MB (in binary)

type JoditEditorProps = IJoditEditorProps & {
  id?: string;
  name?: string;
  permiteVideo?: boolean;
  permiteInserirArquivo?: boolean;
  imagensCentralizadas?: boolean;
  quantidadeMaximaImagens?: number;
  tamanhoMaximoUploadMb?: number;
  hasError?: boolean;
  disabled?: boolean;
  erro?: (mensagem: string) => void;
};

const JoditEditorSME = forwardRef((props: JoditEditorProps, ref: any) => {
  const {
    config,
    id,
    name,
    permiteVideo,
    permiteInserirArquivo = false,
    imagensCentralizadas = false,
    quantidadeMaximaImagens = 0,
    tamanhoMaximoUploadMb = 10,
    hasError = false,
    value,
    onBlur,
    onChange,
    erro,
    disabled = false,
  } = props;

  const textArea = useRef<JoditType>();

  const defaultButtons = `bold,ul,ol,outdent,indent,font,fontsize,brush,paragraph,${
    permiteInserirArquivo ? 'file,' : ''
  }table,link,align,undo,redo`;

  useLayoutEffect(() => {
    if (ref) {
      if (isFunction(ref)) {
        ref(textArea.current);
      } else {
        ref.current = textArea.current;
      }
    }
  }, [textArea, ref]);

  const excedeuLimiteMaximo = (arquivo: File) =>
    Math.ceil(arquivo.size / BYTES_OF_ONE_MB) > tamanhoMaximoUploadMb;

  const exibirMensagemError = (msg: string, reject?: any) => {
    if (erro) {
      erro(msg);
      reject && reject();
    } else {
      if (reject) reject(new Error(msg));
    }
  };

  const exibirMsgMaximoImg = (reject?: any) => {
    const msg = `Você pode inserir apenas ${quantidadeMaximaImagens} ${
      quantidadeMaximaImagens > 1 ? 'imagens' : 'imagem'
    }`;

    exibirMensagemError(msg, reject);
  };

  const verificaSeTemSvg = (dadosHTML: string) => {
    const temTagSvg = dadosHTML?.match(/<svg/g);

    if (temTagSvg) {
      exibirMensagemError('Não é possivel inserir código HTML com SVG.');
    }

    return temTagSvg;
  };

  useEffect(() => {
    const internalConfig: IJoditEditorProps['config'] = {
      style: {
        font: '16px Arial',
        overflow: 'none',
      },
      tabIndex: 0,
      height: 'auto',
      spellcheck: true,
      language: 'pt_br',
      disabled: disabled,
      showWordsCounter: false,
      askBeforePasteHTML: false,
      showXPathInStatusbar: false,
      askBeforePasteFromWord: false,
      disablePlugins: ['image-properties'],
      buttons: defaultButtons,
      buttonsXS: defaultButtons,
      buttonsMD: defaultButtons,
      buttonsSM: defaultButtons,
      ...config,
      popup: {
        img: Jodit.atom(
          Jodit.defaultOptions.popup.img.filter((btn: any) => {
            return btn?.name !== 'pencil' && btn?.name !== 'valign';
          }),
        ),
      },
    };

    if (props?.config?.uploader?.url && props?.config?.uploader?.headers) {
      internalConfig.uploader = {
        url: props?.config?.uploader?.url,
        headers: props?.config?.uploader?.headers,
        error(e: Error) {
          if (textArea.current?.message && e?.message) {
            textArea.current.message.error(e?.message, 4000);
          }
        },
        getMessage: (resp: IUploaderAnswer): string => {
          if (Array.isArray(resp?.data?.messages)) {
            return resp.data.messages.join(' ');
          }

          return resp?.data?.messages || '';
        },
        buildData: (data: FormData): BuildDataResult => {
          return new Promise((resolve, reject) => {
            if (permiteInserirArquivo) {
              const arquivo: File = data.getAll('files[0]')[0] as File;

              const tiposValidos = config?.uploader?.imagesExtensions?.length
                ? config?.uploader?.imagesExtensions
                : ['jpg', 'jpeg', 'png'];

              const ehImagem = arquivo.type.substring(0, 5) === 'image';
              const ehVideo = arquivo.type.substring(0, 5) === 'video';
              const ehValido = tiposValidos.some((x) => {
                if (x) return arquivo.type.includes(x);
                return false;
              });

              if (excedeuLimiteMaximo(arquivo)) {
                const msg = `Tamanho máximo ${tamanhoMaximoUploadMb}MB.`;
                exibirMensagemError(msg, reject);
              }

              const imagemValida = ehImagem && ehValido;
              const videoValido = ehVideo && permiteVideo;

              if (imagemValida || videoValido) {
                if (ehImagem && quantidadeMaximaImagens) {
                  const quantidadeTotalImagens = (textArea?.current?.value?.match(/<img/g) || [])
                    ?.length;

                  if (quantidadeTotalImagens < quantidadeMaximaImagens) {
                    resolve(data);
                  } else {
                    exibirMsgMaximoImg(reject);
                  }
                } else {
                  resolve(data);
                }
              } else {
                const formato = arquivo.type.split('/').pop()?.replace('+xml', '');

                exibirMensagemError(`O formato .${formato} não é valido.`, reject);
              }
            } else {
              exibirMensagemError('Não é possível inserir arquivo', reject);
            }
          });
        },
        isSuccess: (response: RetornoArquivoEditorDto): boolean => response?.success,
        process: (response: RetornoArquivoEditorDto): ArquivoEditorDto => response?.data,
        defaultHandlerSuccess: (dados: ArquivoEditorDto) => {
          if (dados?.path && textArea.current?.selection) {
            if (dados?.contentType?.startsWith('video')) {
              textArea.current.selection.insertHTML(
                `<video width="600" height="240" controls><source src="${dados.path}"></video>`,
              );
            } else {
              textArea.current.selection.insertHTML(
                `<img src="${
                  dados.path
                }" style="max-width: 100%; max-height: 700px; object-fit: cover; object-position: bottom; ${
                  imagensCentralizadas ? 'display: block; margin: auto;' : ''
                }"/>`,
              );
            }
          }
        },
      };
    }

    const element = textArea.current;
    const jodit = Jodit.make(element, internalConfig);
    jodit.value = value;

    textArea.current = jodit;

    const elementTextArea = textArea?.current?.editorDocument?.getElementsByClassName(
      'jodit',
    )?.[0] as any;

    if (elementTextArea) {
      elementTextArea.translate = false;
      elementTextArea.className = `${elementTextArea.className} notranslate`;
    }

    if (textArea?.current?.workplace) {
      textArea.current.workplace.tabIndex = -1;
    }

    return () => {
      if (jodit) {
        jodit.destruct();
      }

      if (textArea?.current?.destruct) {
        textArea.current.destruct();
      }

      textArea.current = element;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, defaultButtons, imagensCentralizadas]);

  const verificaSePodeInserirArquivo = (dadosHTML: string) => {
    const temImagemNosDadosColados = dadosHTML?.match(/<img/g) || [];
    const temVideoNosDadosColados = dadosHTML?.match(/<video/g) || [];

    const qtdElementoImg = temImagemNosDadosColados?.length || 0;
    const qtdElementoVideo = temVideoNosDadosColados?.length || 0;

    if (!permiteInserirArquivo && (qtdElementoImg || qtdElementoVideo)) {
      exibirMensagemError('Não é possível inserir arquivo');

      return false;
    }
    // TODO - Validar /temp
    // if (temImagemNosDadosColados) {
    //   const urlAmbiente = url.replace('/api', '');
    //   const regex = new RegExp(`<img[^>]*src=".*?${urlAmbiente}/temp/.*?"[^>]*>`);
    //   const temImagemPastaTemporaria = dadosHTML?.match(regex) || [];

    //   if (temImagemPastaTemporaria.length) {
    //     exibirMensagemError('Não é possível inserir este arquivo');
    //     return false;
    //   }
    // }

    if (qtdElementoImg && quantidadeMaximaImagens) {
      const qtdElementoImgAtual = textArea?.current?.editorDocument?.querySelectorAll?.('img');
      const totalImg = qtdElementoImg + (qtdElementoImgAtual?.length || 0);

      if (totalImg > quantidadeMaximaImagens || !dadosHTML) {
        if (dadosHTML) {
          exibirMsgMaximoImg();
        }

        return false;
      }
    } else if (qtdElementoImg && !dadosHTML) {
      return false;
    }

    return true;
  };

  const validarNovoValor = (newValue: any) => {
    const temSvg = verificaSeTemSvg(newValue);
    if (temSvg) return false;

    const naoPodeInserirArquivo = !verificaSePodeInserirArquivo(newValue);
    if (naoPodeInserirArquivo) return false;

    return true;
  };

  const bloquearTraducaoNavegador = () => {
    const isEdge = navigator?.userAgent?.indexOf?.('Edg') !== -1;
    if (isEdge && textArea?.current) {
      const elementTextArea =
        textArea?.current?.editorDocument?.getElementsByClassName('jodit')?.[0];

      const elementBodyTextArea = elementTextArea
        ? elementTextArea.getElementsByTagName('body')[0]
        : null;
      if (elementBodyTextArea) {
        const childrens = elementBodyTextArea?.children;

        if (childrens?.length) {
          for (let index = 0; index < childrens.length; index++) {
            childrens[index].className = 'notranslate';
          }
        }
      }
    }
  };

  useEffect(() => {
    bloquearTraducaoNavegador();
  }, [value]);

  const onChangePadrao = (newValue: string) => {
    const texto = textArea?.current?.text?.trim();
    const temImagemOuVideo =
      (permiteVideo && textArea?.current?.value?.includes('<video')) ||
      textArea?.current?.value?.includes('<img');

    if (texto || temImagemOuVideo) {
      onChange && onChange(newValue);
    } else {
      onChange && onChange('');
    }
  };

  useEffect(() => {
    if (!textArea?.current) return;

    const onBlurHandler = () => onBlur && onBlur(textArea?.current?.value);

    const onChangeHandler = (newValue: string, oldValue: string) => {
      const alteracaoValida = validarNovoValor(newValue);

      if (alteracaoValida) {
        onChangePadrao(newValue);
      } else {
        onChangePadrao(oldValue);
      }
    };

    const onFocusHandler = (e: any) => {
      if (e?.target && textArea?.current?.selection?.setCursorIn)
        setTimeout(() => {
          textArea?.current?.selection.setCursorIn(e.target);
        }, 100);
    };

    textArea.current.events
      .on('blur', onBlurHandler)
      .on('change', onChangeHandler)
      .on('focus', onFocusHandler);

    return () => {
      textArea.current?.events
        ?.off('blur', onBlurHandler)
        .off('change', onChangeHandler)
        .off('focus', onFocusHandler);
    };
  }, [onBlur, onChange]);

  return (
    <EditorContainer hasError={hasError}>
      <textarea defaultValue={value} name={name} id={id} ref={textArea as any} />
    </EditorContainer>
  );
});

JoditEditorSME.displayName = 'JoditEditorSME';

export default React.memo(JoditEditorSME);
