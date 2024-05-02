import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import { PARECER_NAO_INFORMADO } from '~/core/constants/mensagens';

type ModalParecerProps = {
  onClickSalvar: () => void;
};

export const ModalParecerConteudoInicial: React.FC<ModalParecerProps> = ({ onClickSalvar }) => {
  return (
    <>
      <Form.Item
        name='descricao'
        label='Descrição do parecer:'
        rules={[{ required: true, message: PARECER_NAO_INFORMADO }]}
        style={{ marginBottom: 12 }}
      >
        <Input.TextArea
          rows={5}
          disabled={false}
          maxLength={1000}
          id={CF_INPUT_TEXT_AREA}
          style={{ resize: 'none' }}
        />
      </Form.Item>
      <Row justify='end'>
        <Col>
          <ButtonSecundary size='small' disabled={false} onClick={onClickSalvar}>
            Salvar
          </ButtonSecundary>
        </Col>
      </Row>
    </>
  );
};
