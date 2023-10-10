import { Col, Form, FormInstance, Radio, RadioChangeEvent, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CheckboxAcaoInformatica from '~/components/lib/checkbox';
import SelectCriterioCertificacao from '~/components/main/input/criterio-certificacao';
import EditorTexto from '~/components/main/input/editor-texto';
type FormDatasProps = {
  form: FormInstance;
};

const FormularioCertificacao: React.FC<FormDatasProps> = ({ form }) => {
  const paramsRoute = useParams();
  const [valuePossuiCertificado, setValuePossuiCertificado] = useState(false);
  const [editorRequerido, setEditorRequerido] = useState(false);
  const obterPossuiCertificado = (e: RadioChangeEvent) => {
    setValuePossuiCertificado(e.target.value);
    form.setFieldValue('cursoComCertificado', e.target.value);
  };

  const obterDados = async () => {
    setTimeout(() => {
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 2000);
  };
  const verificarCriteriosSelecionados = () => {
    const atividadeObrigatorioCodigo = 4;
    const criteriosSelecionados: number[] = form.getFieldValue('criterioCertificacao');
    setTimeout(() => {
      setEditorRequerido(criteriosSelecionados.includes(atividadeObrigatorioCodigo));
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 2000);
  };
  useEffect(() => {
    obterDados();
    verificarCriteriosSelecionados();
  }, [obterDados(), verificarCriteriosSelecionados()]);
  const id = paramsRoute?.id || 0;
  return (
    <>
      <Col>
        <Row>
          <Col>
            <Form.Item
              label='Possui Certificado'
              name='cursoComCertificado'
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
            <SelectCriterioCertificacao onchange={verificarCriteriosSelecionados} />
          </Col>
          <Col span={24}>
            <EditorTexto
              nome='descricaoDaAtividade'
              label='Descrição da atividade obrigatória para certificação'
              required={editorRequerido}
              mensagemTooltip='Deve ser proposta ao menos uma atividade que será considerada na atribuição do conceito ao participante, na qual o cursista se posicione criticamente sobre suas ações ou experiências no exercício da sua atuação profissional. A atividade obrigatória deve atender a diversidade e as particularidades do público-alvo.'
            />
          </Col>
          <Col span={24}>
            <CheckboxAcaoInformatica form={form} propostaId={Number(id)} />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default FormularioCertificacao;
