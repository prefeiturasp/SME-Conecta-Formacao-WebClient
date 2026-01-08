import { InboxOutlined } from '@ant-design/icons';
import { Form, FormInstance, FormItemProps, Upload } from 'antd';
import { DraggerProps, RcFile, UploadFile } from 'antd/es/upload';
import React from 'react';
import styled from 'styled-components';
import { notification } from '~/components/lib/notification';

const { Dragger } = Upload;

export const permiteInserirFormato = (arquivo: any, tiposArquivosPermitidos: string) => {
  if (tiposArquivosPermitidos?.trim()) {
    const listaPermitidos = tiposArquivosPermitidos
      .split(',')
      .map((tipo) => tipo?.trim()?.toLowerCase());

    const tamanhoNome = arquivo?.name?.length;

    const permiteTipo = listaPermitidos.find((tipo) => {
      const nomeTipoAtual = arquivo.name.substring(tamanhoNome, tamanhoNome - tipo.length);

      if (nomeTipoAtual) {
        return tipo?.toLowerCase() === nomeTipoAtual?.toLowerCase();
      }

      return false;
    });

    return !!permiteTipo;
  }
  return true;
};

const downloadBlob = (data: any, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');

  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);

  document.body.removeChild(a);
};

export const ContainerDraggerUpload = styled(Dragger)`
  &.ant-upload-wrapper
    .ant-upload-list
    .ant-upload-list-item
    .ant-upload-list-item-actions
    .ant-upload-list-item-action {
    opacity: 1;
  }
`;

type UploadArquivosProps = {
  form: FormInstance;
  draggerProps?: DraggerProps;
  formItemProps: FormItemProps & { name: string };
  tiposArquivosPermitidos?: string;
  tamanhoMaxUploadPorArquivo?: number;
  subTitulo?: string;
  downloadService: (codigosArquivo: string) => any;
  uploadService: (formData: FormData, configuracaoHeader: any) => any;
  formDataFieldName?: string;
  mensagemFormatoNaoPermitido?: string;
  mensagemSucessoUpload?: string;
};

const TAMANHO_PADRAO_MAXIMO_UPLOAD = 100;

const UploadArquivosSME: React.FC<UploadArquivosProps> = (props) => {
  const {
    form,
    draggerProps,
    formItemProps,
    uploadService,
    downloadService,
    subTitulo,
    tiposArquivosPermitidos = '',
    tamanhoMaxUploadPorArquivo = TAMANHO_PADRAO_MAXIMO_UPLOAD,
    formDataFieldName = 'file',
    mensagemFormatoNaoPermitido = 'Formato não permitido',
    mensagemSucessoUpload = 'arquivo carregado com sucesso',
  } = props;

  if (!formItemProps.name) {
    formItemProps.name = 'arquivos';
  }

  const listaDeArquivos = Form.useWatch(formItemProps.name, form);

  const setNovoValor = (novoMap: any) => {
    if (form && form.setFieldValue) {
      form.setFieldValue(formItemProps.name, novoMap);
    }
  };

  const excedeuLimiteMaximo = (arquivo: File) => {
    const tamanhoArquivo = arquivo.size / 1024 / 1024;
    return tamanhoArquivo > tamanhoMaxUploadPorArquivo;
  };

  const beforeUploadDefault = (arquivo: RcFile) => {
    if (!permiteInserirFormato(arquivo, tiposArquivosPermitidos)) {
      notification.error({
        message: 'Erro',
        description: mensagemFormatoNaoPermitido,
      });
      return false;
    }

    if (excedeuLimiteMaximo(arquivo)) {
      notification.error({
        message: 'Erro',
        description: `Tamanho máximo ${tamanhoMaxUploadPorArquivo}MB`,
      });
      return false;
    }

    return true;
  };

  const customRequestDefault = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };

    fmData.append(formDataFieldName, file);

    uploadService(fmData, config)
      .then((resposta: any) => {
        const codigo =
          resposta?.data?.codigo ||
          resposta?.dados?.codigo ||
          resposta?.data?.arquivoCodigo ||
          resposta?.dados?.arquivoCodigo ||
          resposta.data;
        const id = resposta?.data?.id || resposta?.dados?.id;
        const urlDownload = resposta?.dados?.urlDownload || resposta?.data?.urlDownload;

        file.id = id;
        file.arquivoCodigo = codigo;
        if (urlDownload) {
          file.urlDownload = urlDownload;
        }

        onSuccess(file, codigo);
      })
      .catch((e: any) => onError({ event: e }));
  };

  const onRemoveDefault = async (arquivo: UploadFile<any>) => {
    if (arquivo.xhr) {
      notification.success({
        message: 'Sucesso',
        description: `Arquivo ${arquivo.name} excluído com sucesso`,
      });
      return true;
    }
    return false;
  };

  const atualizaListaArquivos = (fileList: any, file: UploadFile<any>) => {
    const novaLista = fileList.filter((item: any) => item.uid !== file.uid);
    const novoMap = [...novaLista];

    setNovoValor(novoMap);
  };

  const onChangeDefault = ({ file, fileList }: any) => {
    const { status } = file;

    if (excedeuLimiteMaximo(file)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (!permiteInserirFormato(file, tiposArquivosPermitidos)) {
      atualizaListaArquivos(fileList, file);
      return;
    }

    const novoMap = [...fileList]?.filter((f) => f?.status !== 'removed');

    if (status === 'done') {
      notification.success({
        message: 'Sucesso',
        description: `${mensagemSucessoUpload}`,
      });
    } else if (status === 'error') {
      atualizaListaArquivos(fileList, file);
      return;
    }

    if (status === 'done' || status === 'removed') {
      if (form && form.setFieldValue) {
        form.setFieldValue(formItemProps.name, novoMap);
      }
    }

    setNovoValor(novoMap);
  };

  const onDownloadDefault = (arquivo: UploadFile<any>) => {
    const codigoArquivo = arquivo.xhr;
    downloadService(codigoArquivo)
      .then((resposta: any) => {
        downloadBlob(resposta.data, arquivo.name);
      })
      .catch(() =>
        notification.error({
          message: 'Erro',
          description: 'Erro ao tentar fazer download',
        }),
      );
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return listaDeArquivos;
  };

  return (
    <Form.Item valuePropName='fileList' getValueFromEvent={normFile} {...formItemProps}>
      <ContainerDraggerUpload
        name='file'
        listType='text'
        fileList={listaDeArquivos}
        showUploadList={{ showDownloadIcon: true }}
        onRemove={draggerProps?.onRemove || onRemoveDefault}
        onChange={draggerProps?.onChange || onChangeDefault}
        onDownload={draggerProps?.onDownload || onDownloadDefault}
        beforeUpload={draggerProps?.beforeUpload || beforeUploadDefault}
        customRequest={draggerProps?.customRequest || customRequestDefault}
        {...draggerProps}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Clique ou arraste para fazer o upload do arquivo</p>
        <p className='ant-upload-hint'>
          {subTitulo ?? 'Deve permitir apenas imagens com no máximo 5MB cada'}
        </p>
      </ContainerDraggerUpload>
    </Form.Item>
  );
};

export default UploadArquivosSME;
