import { Col, Form, FormInstance, Radio, RadioChangeEvent, Row } from 'antd';
import React, { useState } from 'react';
type FormDatasProps = {
  form: FormInstance;
};

const FormularioCertificacao: React.FC<FormDatasProps> = () => {
  const [valuePossuiCertificado, setValuePossuiCertificado] = useState(false);
  const obterPossuiCertificado = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValuePossuiCertificado(e.target.value);
  };
  return (
    <>
      <Col>
        <Row>
          <Col>
            <Form.Item
              label='Possui Certificado'
              name='criterioCertificacao'
              rules={[{ required: true }]}
            >
              <Radio.Group
                onChange={obterPossuiCertificado}
                value={valuePossuiCertificado}
                defaultValue={false}
              >
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioCertificacao;
