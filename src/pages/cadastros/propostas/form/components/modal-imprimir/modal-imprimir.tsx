import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { RadioRelatorioLauda } from '~/components/main/input/imprimir-lauda';
import { obterRelatorioLaudaPublicacao } from '~/core/services/proposta-service';
import { obterRelatorioLaudaCompletaDocx } from '~/core/services/relatorio-service';

type ModalImprimirProps = {
  propostaId: number;
  onFecharButton: () => void;
};

export const ModalImprimir: React.FC<ModalImprimirProps> = ({ propostaId, onFecharButton }) => {
  const form = useFormInstance();
  const relatorioLaudaWatch = useWatch('relatorioLauda', form);

  const downloadFile = (blob: Blob, filename: string) => {
    const urlBlob = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = urlBlob;
    a.download = filename;
    a.click();
    globalThis.URL.revokeObjectURL(urlBlob);
    a.remove();
  };

  const downloadUrlAsBlob = (url: string, filename: string) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
      })
      .then((blob) => {
        if (!blob) return;
        downloadFile(blob, filename);
      });
  };

  const handleImprimir = () => {
    if (relatorioLaudaWatch) {
      obterRelatorioLaudaPublicacao(propostaId).then((resposta) => {
        if (resposta.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'Seu relatório foi gerado com sucesso!',
          });
          downloadUrlAsBlob(resposta.dados, 'Relatório Lauda de publicação.doc');
          onFecharButton();
        }
      });
    } else {
      obterRelatorioLaudaCompletaDocx(propostaId).then((resposta) => {
        if (resposta.sucesso) {
          notification.success({
            message: 'Sucesso',
            description: 'Seu relatório foi gerado com sucesso!',
          });
          downloadFile(resposta.dados, 'Relatório Lauda completa.docx');
          onFecharButton();
        }
      });
    }
  };

  const handleFechar = () => {
    onFecharButton();
  };

  return (
    <Modal
      open
      title='Impressão de relatório'
      onOk={handleImprimir}
      onCancel={handleFechar}
      centered
      destroyOnClose
      okText='Gerar'
      cancelText='Cancelar'
    >
      <RadioRelatorioLauda
        formItemProps={{
          initialValue: true,
          name: 'relatorioLauda',
          label: 'Qual relatório você deseja gerar?',
        }}
        radioGroupProps={{
          disabled: false,
        }}
      />
    </Modal>
  );
};
