import { Col, Divider, Form, Modal, Row, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import EditorTexto from '~/components/main/input/editor-texto';
import { PROPOSTA_DEVOLVIDA_SUCESSO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaDevolverDTO } from '~/core/dto/proposta-devolver-dto';
import { devolverProposta } from '~/core/services/proposta-service';

type ModalDevolverProps = {
  openModal: boolean;
  onCloseModal: (salvo: boolean) => void;
  id: string | 0;
};

const ModalDevolverGestao: React.FC<ModalDevolverProps> = ({ openModal, onCloseModal, id = 0 }) => {
  const [formDevolver] = useForm();

  const salvarDados = () => {
    const values: PropostaDevolverDTO = formDevolver.getFieldsValue();
    devolverProposta(id, values).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: PROPOSTA_DEVOLVIDA_SUCESSO,
        });

        onCloseModal(true);
      }
    });
  };

  const onFechar = () => {
    formDevolver.resetFields();
    onCloseModal(false);
  };

  const onSalvar = () => {
    formDevolver.validateFields().then(salvarDados);
  };

  useEffect(() => {
    formDevolver.resetFields();
  }, [formDevolver]);

  return (
    <>
      {openModal ? (
        <Modal
          open
          title='Devolver para ajustes'
          centered
          destroyOnClose
          onCancel={onFechar}
          onOk={onSalvar}
          okText='Salvar'
          cancelText='Cancelar'
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          <Form
            form={formDevolver}
            layout='vertical'
            autoComplete='off'
            validateMessages={validateMessages}
            disabled={false}
          >
            <Content>
              <Divider orientation='left' />
              <Col xs={24}>
                <Row gutter={16}>
                  <Col xs={24}>
                    <EditorTexto nome='Justificativa' label='Justificativa' />
                  </Col>
                </Row>
              </Col>
            </Content>
          </Form>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalDevolverGestao;
