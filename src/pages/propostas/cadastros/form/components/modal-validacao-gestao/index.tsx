import { Col, Divider, Form, Modal, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import EditorTexto from '~/components/main/input/editor-texto';
import { validateMessages } from '~/core/constants/validate-messages';
import RadioParecer from './components/radio-parecer';

type ModalValidacaoGestaoProps = {
  openModal: boolean;
  onCloseModal: () => void;
  id: string | 0;
};

const ModalValidacaoGestao: React.FC<ModalValidacaoGestaoProps> = ({
  openModal,
  onCloseModal,
  id = 0,
}) => {
  const [formParecer] = useForm();

  const salvarDados = () => {
    onFechar();
  };

  const onFechar = () => {
    formParecer.resetFields();

    onCloseModal();
  };

  const onSalvar = () => {
    formParecer.validateFields().then(salvarDados);
  };

  useEffect(() => {
    formParecer.resetFields();
  }, [formParecer]);

  return (
    <>
      {openModal ? (
        <Modal
          open
          title='Selecione o parecer para a proposta'
          centered
          destroyOnClose
          onCancel={onFechar}
          onOk={onSalvar}
          okText='Salvar'
          cancelText='Cancelar'
        >
          <Form
            form={formParecer}
            layout='vertical'
            autoComplete='off'
            validateMessages={validateMessages}
          >
            <Content>
              <Divider orientation='left' />
              <Col xs={24}>
                <Row gutter={16}>
                  <Col xs={15}>
                    <RadioParecer
                      formItemProps={{
                        name: 'situacao',
                        label: 'Parecer',
                      }}
                    />
                  </Col>
                </Row>
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

export default ModalValidacaoGestao;
