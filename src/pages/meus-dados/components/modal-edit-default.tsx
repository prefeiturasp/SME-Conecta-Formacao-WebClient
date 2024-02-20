import { Modal as ModalAntd, Spin } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosResponse, HttpStatusCode } from 'axios';
import React, { PropsWithChildren, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification, openNotificationErrors } from '~/components/lib/notification';
import {
  CF_BUTTON_MODAL_ALTERAR,
  CF_BUTTON_MODAL_CANCELAR,
} from '~/core/constants/ids/button/intex';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { Colors } from '~/core/styles/colors';

const { confirm } = ModalAntd;

type ModalEditDefaultServiceProps = {
  email: string;
  telefone: string;
} & SenhaNovaDTO;

type ModalEditDefaultProps = {
  service: (values: ModalEditDefaultServiceProps) => Promise<AxiosResponse<boolean>>;
  updateFields?: (values: ModalEditDefaultServiceProps) => void;
  title: string;
  form: FormInstance<ModalEditDefaultServiceProps>;
  mensagemConfirmarCancelar: string;
  permiteEdicao?: boolean;
  closeModal: () => void;
} & PropsWithChildren;

const ModalEditDefault: React.FC<ModalEditDefaultProps> = ({
  service,
  updateFields,
  title,
  form,
  mensagemConfirmarCancelar,
  closeModal,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: 'Registro alterado com sucesso!',
    });
  };

  const handleOk = () => {
    setLoading(true);

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
        content: mensagemConfirmarCancelar,
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
    <Modal
      open
      title={title}
      onOk={validateFields}
      onCancel={showConfirmCancel}
      centered
      destroyOnClose
      cancelButtonProps={{ disabled: loading, id: CF_BUTTON_MODAL_CANCELAR }}
      okButtonProps={{ disabled: loading, id: CF_BUTTON_MODAL_ALTERAR }}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      okText='Alterar'
    >
      <Spin spinning={loading}>{children}</Spin>
    </Modal>
  );
};

export default ModalEditDefault;
