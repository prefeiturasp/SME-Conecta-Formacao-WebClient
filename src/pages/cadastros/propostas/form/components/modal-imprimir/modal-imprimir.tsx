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

  const handleImprimir = () => {
    const endpoint = relatorioLaudaWatch
      ? obterRelatorioLaudaPublicacao
      : obterRelatorioLaudaCompleta;

    endpoint(propostaId).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Seu relatório foi gerado com sucesso!',
        });
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
