import { useForm } from 'antd/es/form/Form';
import Modal from '~/components/lib/modal';
import React, { PropsWithChildren, useState } from 'react';
import { Modal as ModalAntd, Spin } from 'antd';
import { notification } from '~/components/lib/notification';
import { Colors } from '~/core/styles/colors';

const { confirm } = ModalAntd;

type ModalEditCargoFuncaoProps = {
  closeModal: () => void;
} & PropsWithChildren;

export const ModalEditCargoFuncao: React.FC<ModalEditCargoFuncaoProps> = ({
  closeModal,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: 'Registro alterado com sucesso!',
    });
  };

  const handleOk = () => {
    setLoading(true);

/*
    service(form.getFieldsValue())
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok && resposta?.data && updateFields) {
          updateFields(form.getFieldsValue());
          openNotificationSuccess();
        } else if (resposta?.status === HttpStatusCode.Ok && resposta?.data) {
          openNotificationSuccess();
        }
        closeModal();
      })
      .catch((erro) => {
        if (erro?.response?.data?.mensagens?.length) {
          openNotificationErrors(erro.response.data.mensagens);
        }
      })
      .finally(() => setLoading(false));
      */
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      handleOk();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  const showConfirmCancel = () => {
    if (form.isFieldsTouched()) {
      confirm({
        width: 500,
        title: 'Atenção',
        icon: <></>,
        content: 'Você não salvou o novo cargo/função, confirma que deseja descartar a alteração?',
        onOk() {
          handleCancel();
        },
        okButtonProps: { type: 'default' },
        cancelButtonProps: {
          type: 'text',
          style: { color: Colors.Neutral.DARK },
        },
        okText: 'Confirmar',
        cancelText: 'Cancelar',
      });
    } else {
      handleCancel();
    }
  };

  return (
    <Modal open
      title='Alterar Cargo/Função'
      onOk={ validateFields }
      onCancel={ showConfirmCancel }
      centered
      destroyOnClose
      closable={ !loading }
      maskClosable={ !loading }
      keyboard={ !loading }
      okText='Alterar'>
      <Spin spinning={loading}>{children}</Spin>
    </Modal>)
};
