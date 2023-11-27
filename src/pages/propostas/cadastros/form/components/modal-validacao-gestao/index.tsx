import { Col, Divider, Form, Modal, Row, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import EditorTexto from '~/components/main/input/editor-texto';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaParecerDTO } from '~/core/dto/proposta-parecer-dto';
import { parecerProposta } from '~/core/services/proposta-service';
import { PROPOSTA_PARECER_SUCESSO } from '~/core/constants/mensagens';
import RadioParecer from './components/radio-parecer';

type ModalValidacaoGestaoProps = {
  openModal: boolean;
  onCloseModal: (salvo: boolean) => void;
  id: string | 0;
};

const ModalValidacaoGestao: React.FC<ModalValidacaoGestaoProps> = ({
  openModal,
  onCloseModal,
  id = 0,
}) => {
  const [formParecer] = useForm();

  const salvarDados = () => {
    const values: PropostaParecerDTO = formParecer.getFieldsValue();
    parecerProposta(id, values).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: PROPOSTA_PARECER_SUCESSO,
        });

        onCloseModal(true);
      }
    });
  };

  const onFechar = () => {
    formParecer.resetFields();

    onCloseModal(false);
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
          okButtonProps={{ disabled: false }}
          cancelButtonProps={{ disabled: false }}
        >
          <Form
            form={formParecer}
            layout='vertical'
            autoComplete='off'
            validateMessages={validateMessages}
            disabled={false}
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
