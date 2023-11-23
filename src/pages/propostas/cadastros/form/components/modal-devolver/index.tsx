import { Col, Divider, Form, Modal, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import EditorTexto from '~/components/main/input/editor-texto';
import { validateMessages } from '~/core/constants/validate-messages';

type ModalDevolverProps = {
  openModal: boolean;
  onCloseModal: () => void;
  id: string | 0;
};

const ModalDevolver: React.FC<ModalDevolverProps> = ({ openModal, onCloseModal, id = 0 }) => {
  const [formDevolver] = useForm();

  const salvarDados = () => {
    onFechar();
  };

  const onFechar = () => {
    formDevolver.resetFields();

    onCloseModal();
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
        >
          <Form
            form={formDevolver}
            layout='vertical'
            autoComplete='off'
            validateMessages={validateMessages}
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

export default ModalDevolver;
