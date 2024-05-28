import { Spin } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { AxiosResponse, HttpStatusCode } from 'axios';
import React, { PropsWithChildren, useContext, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification, openNotificationErrors } from '~/components/lib/notification';
import {
  CF_BUTTON_MODAL_ALTERAR,
  CF_BUTTON_MODAL_CANCELAR,
} from '~/core/constants/ids/button/intex';
import { SenhaNovaDTO } from '~/core/dto/senha-nova-dto';
import { confirmacao } from '~/core/services/alerta-service';
import { MeusDadosContext } from '../provider';

type ModalEditDefaultServiceProps = {
  nome: string;
  email: string;
  telefone: string;
  nomeUnidade: string;
  codigoUnidade: string;
  emailEducacional: string;
} & SenhaNovaDTO;

type ModalEditDefaultProps = {
  service: (values: ModalEditDefaultServiceProps) => Promise<AxiosResponse<boolean>>;
  updateFields?: (values: ModalEditDefaultServiceProps) => void;
  title: string;
  form: FormInstance<ModalEditDefaultServiceProps>;
  mensagemConfirmarCancelar: string;
  permiteEdicao?: boolean;
  closeModal: () => void;
  desativarBotaoAlterar?: boolean;
} & PropsWithChildren;

const ModalEditDefault: React.FC<ModalEditDefaultProps> = ({
  service,
  updateFields,
  title,
  form,
  mensagemConfirmarCancelar,
  desativarBotaoAlterar = false,
  closeModal,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const { obterDados } = useContext(MeusDadosContext);

  const mensagemSucesso = (
    <>
      <p>
        Registro alterado com sucesso!
        <br />
        Por favor, realize o login novamente para aplicar a alteração no sistema
      </p>
    </>
  );
  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: mensagemSucesso,
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
        obterDados();
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
      confirmacao({
        content: mensagemConfirmarCancelar,
        onOk() {
          handleCancel();
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
      okButtonProps={{ disabled: loading || desativarBotaoAlterar, id: CF_BUTTON_MODAL_ALTERAR }}
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
