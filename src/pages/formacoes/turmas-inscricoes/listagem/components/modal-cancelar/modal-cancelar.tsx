import { Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext, useState } from 'react';
import { FormDefault } from '~/components/lib/form';
import Modal from '~/components/lib/modal';
import AreaTexto from '~/components/main/text/text-area';
import { MOTIVO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { TurmasInscricoesListaPaginadaContext } from '../../provider';

type ModalCancelarInscricaoProps = {
  ids: number[];
  onFecharButton: () => void;
};

export const ModalCancelarInscricao: React.FC<ModalCancelarInscricaoProps> = ({
  ids,
  onFecharButton,
}) => {
  const [form] = useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const { onClickCancelar } = useContext(TurmasInscricoesListaPaginadaContext);

  const handleCancelar = async () => {
    setLoading(true);

    const valoresSalvar = form.getFieldsValue(true);
    const motivo = valoresSalvar?.motivo;

    const sucesso = await onClickCancelar(ids, motivo);
    if (sucesso) {
      onFecharButton();
    }

    setLoading(false);
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      handleCancelar();
    });
  };

  const handleFechar = () => {
    form.resetFields();
    onFecharButton();
  };

  return (
    <Modal
      open
      title='Cancelar inscrição'
      onOk={validateFields}
      onCancel={handleFechar}
      centered
      destroyOnClose
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      cancelButtonProps={{
        disabled: loading,
      }}
      okButtonProps={{
        disabled: loading,
      }}
      okText='Cancelar inscrição'
      cancelText='Voltar'
    >
      <Spin spinning={loading}>
        <FormDefault form={form}>
          <AreaTexto
            formItemProps={{
              label: 'Informar motivo',
              name: 'motivo',
              rules: [{ required: true, message: MOTIVO_NAO_INFORMADO }],
            }}
          />
        </FormDefault>
      </Spin>
    </Modal>
  );
};
