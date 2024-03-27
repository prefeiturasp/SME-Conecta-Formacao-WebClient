import { useForm } from 'antd/es/form/Form';
import Modal from '~/components/lib/modal';
import React, { useState } from 'react';
import { Form, Input, Modal as ModalAntd, Select, Spin } from 'antd';
import { notification } from '~/components/lib/notification';
import { Colors } from '~/core/styles/colors';
import { alterarVinculo } from '~/core/services/inscricao-service';

const { confirm } = ModalAntd;

type ModalEditCargoFuncaoProps = {
  initialValues: { id: number, label: string, value: string };
  updateFields: (values: { cargoFuncaoCodigo: string, cargoFuncao: string }) => void;
  closeModal: () => void;
};

export const ModalEditCargoFuncao: React.FC<ModalEditCargoFuncaoProps> = ({
  initialValues,
  updateFields,
  closeModal
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
        content: 'Você não salvou o novo cargo/função/vínculo, confirma que deseja descartar a alteração?',
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
      title='Alterar Cargo/Função/Vínculo'
      onOk={ validateFields }
      onCancel={ showConfirmCancel }
      centered
      destroyOnClose
      closable={ !loading }
      maskClosable={ !loading }
      keyboard={ !loading }
      okText='Alterar'>
      <Spin spinning={loading}>
        <Form form={ form } layout='vertical' autoComplete='off'>
          <Form.Item label='Cargo' name='usuarioCargoSelecionado'>
            <Select
              //disabled={initialValues?.usuarioCargos?.length == 1}
              allowClear
              /*
              options={
                initialValues?.usuarioCargos?.length ? initialValues.usuarioCargos : []
              }
              */
              onChange={() => form.setFieldValue('usuarioFuncaoSelecionado', undefined)}
              placeholder='Selecione um cargo'
              //id={CF_SELECT_CARGO}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>)
};
