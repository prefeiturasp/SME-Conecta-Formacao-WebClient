import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { RadioRelatorioLauda } from '~/components/main/input/imprimir-lauda';
import {
  obterRelatorioLaudaCompleta,
  obterRelatorioLaudaPublicacao,
} from '~/core/services/proposta-service';

type ModalImprimirProps = {
  propostaId: number;
  onFecharButton: () => void;
};

export const ModalImprimir: React.FC<ModalImprimirProps> = ({ propostaId, onFecharButton }) => {
  const form = useFormInstance();
  const relatorioLaudaWatch = useWatch('relatorioLauda', form);

  const downloadBlob = (url: string) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
      })
      .then((blob) => {
        if (!blob) return;

        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = urlBlob;
        a.download = relatorioLaudaWatch
          ? 'Relatório Lauda de publicação.doc'
          : 'Relatório Lauda completa.pdf';
        a.click();
        window.URL.revokeObjectURL(urlBlob);
        document.body.removeChild(a);
      });
  };

  const handleImprimir = () => {
    const endpoint = relatorioLaudaWatch
      ? obterRelatorioLaudaPublicacao
      : obterRelatorioLaudaCompleta;

    endpoint(propostaId).then((resposta) => {
      if (resposta.sucesso) {
        const url = resposta.dados;
        notification.success({
          message: 'Sucesso',
          description: 'Seu relatório foi gerado com sucesso!',
        });

        downloadBlob(url);
        onFecharButton();
      }
    });
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
