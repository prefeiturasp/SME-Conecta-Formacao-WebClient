import { Col, Form, Input, Row } from 'antd';
import React from 'react';

interface SecaoInformacoesAdicionaisProps {
  disabled?: boolean;
}

export const SecaoInformacoesAdicionais: React.FC<SecaoInformacoesAdicionaisProps> = ({ disabled }) => {
  return (
    <>
      <Row gutter={[16, 8]} style={{ marginTop: 32 }}>
        <Col span={24}>
          <div style={{ fontWeight: 700, fontSize: '20px', lineHeight: '100%', color: '#42474A', marginBottom: 8 }}>
            Informações adicionais
          </div>
          <p style={{ marginBottom: 16 }}>
            Insira demais informações importantes para o registro. Este é um campo opcional.
          </p>
        </Col>
      </Row>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Form.Item name='observacao'>
            <Input.TextArea
              rows={4}
              placeholder='Digite as informações adicionais...'
              maxLength={500}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};