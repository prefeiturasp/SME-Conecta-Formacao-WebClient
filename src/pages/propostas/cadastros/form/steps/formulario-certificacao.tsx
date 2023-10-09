import { Col, Form, FormInstance, Input, Radio, RadioChangeEvent, Row } from 'antd';
import React, { useState } from 'react';
import CheckboxAcaoInformatica from '~/components/lib/checkbox';
import SelectCriterioCertificacao from '~/components/main/input/criterio-certificacao';
import EditorTexto from '~/components/main/input/editor-texto';
type FormDatasProps = {
  form: FormInstance;
};

const FormularioCertificacao: React.FC<FormDatasProps> = ({ form }) => {
  const [valuePossuiCertificado, setValuePossuiCertificado] = useState(false);
  const obterPossuiCertificado = (e: RadioChangeEvent) => {
    setValuePossuiCertificado(e.target.value);
    form.setFieldValue('criterioCertificacao', e.target.value);
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
          <Col span={24}>
            <SelectCriterioCertificacao />
          </Col>
          <Col span={24}>
            <EditorTexto
              nome='descricaoDaAtividade'
              label='Descrição da atividade obrigatória para certificação'
              mensagemTooltip='Deve ser proposta ao menos uma atividade que será considerada na atribuição do conceito ao participante, na qual o cursista se posicione criticamente sobre suas ações ou experiências no exercício da sua atuação profissional. A atividade obrigatória deve atender a diversidade e as particularidades do público-alvo.'
            />
          </Col>
          <Col span={24}>
            <CheckboxAcaoInformatica form={form} />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioCertificacao;
