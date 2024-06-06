import { Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import AreaTexto from '~/components/main/text/text-area';
import { JUSTIFICATIVA_NAO_INFORMADA } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { DevolverPropostaDTO } from '~/core/dto/devolver-proposta-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { devolverProposta } from '~/core/services/proposta-service';

type ModalDevolverProps = {
  propostaId: number;
  onFecharButton: () => void;
};

export const ModalDevolver: React.FC<ModalDevolverProps> = ({ propostaId, onFecharButton }) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: 'Proposta devolvida com sucesso!',
    });
  };

  const handleDevolver = () => {
    setLoading(true);
    const valoresSalvar = form.getFieldsValue(true);
    const justificativa = valoresSalvar?.justificativaDevolver;

    const params: DevolverPropostaDTO = {
      justificativa: justificativa,
    };

    devolverProposta(propostaId, params)
      .then((resposta) => {
        if (resposta.sucesso) {
          openNotificationSuccess();
          onFecharButton();
        }
      })
      .finally(() => {
        setLoading(false);
        navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
      });
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      handleDevolver();
    });
  };

  const handleFechar = () => {
    form.resetFields();
    onFecharButton();
  };

  return (
    <Modal
      open
      title='Preenchimento da justificativa'
      onOk={validateFields}
      onCancel={handleFechar}
      centered
      destroyOnClose
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      okText='Devolver'
      cancelText='Fechar'
    >
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
          <AreaTexto
            formItemProps={{
              label: 'Justificar:',
              name: 'justificativaDevolver',
              rules: [{ required: true, message: JUSTIFICATIVA_NAO_INFORMADA }],
            }}
          />
        </Form>
      </Spin>
    </Modal>
  );
};
