import { Col, Form, Radio, RadioChangeEvent, Row } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import CheckboxAcaoInformatica from '~/components/lib/checkbox';
import Select from '~/components/lib/inputs/select';
import SelectCriterioCertificacao from '~/components/main/input/criterio-certificacao';
import EditorTexto from '~/components/main/input/editor-texto';
import { DESCRICAO_DA_CERTIFICACAO_NAO_INFORMADA } from '~/core/constants/mensagens';
import { CampoConsideracaoEnum } from '~/core/enum/campos-proposta-enum';
import { TipoEmissorEnum } from '../../../../../core/enum/tipo-emissor';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonParecer } from '../components/modal-parecer/modal-parecer-button';
import SelectTipoEmissor from '../components/select-tipo-emissor';
import { SelectCoordenadoria } from '~/pages/cadastros/coordenadoria/components/select-coordenadoria/select-coordenadoria';

const FormularioCertificacao: React.FC = () => {
  const form = Form.useFormInstance();

  const { desabilitarCampos } = useContext(PermissaoContext);

  const [valuePossuiCertificado, setValuePossuiCertificado] = useState(false);
  const [editorRequerido, setEditorRequerido] = useState(false);
  const obterPossuiCertificado = (e: RadioChangeEvent) => {
    setValuePossuiCertificado(e.target.value);
    form.setFieldValue('cursoComCertificado', e.target.value);
  };

  const tipoEmissorWatch = Form.useWatch('tipoEmissor', form);
  const tipoEmissorAnteriorRef = useRef<TipoEmissorEnum | undefined>(undefined);

  const obterDados = async () => {
    setTimeout(() => {
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 2000);
  };

  const verificarCriteriosSelecionados = () => {
    const atividadeObrigatorioCodigo = 4;
    const criteriosSelecionados: number[] = form.getFieldValue('criterioCertificacao');
    const criterioExiste = criteriosSelecionados?.includes(atividadeObrigatorioCodigo);
    setTimeout(() => {
      setEditorRequerido(criterioExiste);
      setValuePossuiCertificado(form.getFieldValue('cursoComCertificado'));
    }, 1000);
    const error = form.getFieldError('descricaoDaAtividade');
    if (!criterioExiste && error.length > 0) {
      form.setFields([
        {
          name: 'descricaoDaAtividade',
          errors: [],
        },
      ]);
    }
  };

  useEffect(() => {
    obterDados();
    verificarCriteriosSelecionados();
  }, [verificarCriteriosSelecionados]);

  useEffect(() => {
    const tipoEmissorAtual = tipoEmissorWatch as TipoEmissorEnum | undefined;
    const tipoEmissorAnterior = tipoEmissorAnteriorRef.current;

    const tipoEmissorValido =
      tipoEmissorAtual === TipoEmissorEnum.DRE ||
      tipoEmissorAtual === TipoEmissorEnum.Coordenadoria;

    const tipoFoiAlterado =
      tipoEmissorAnterior !== undefined && tipoEmissorAnterior !== tipoEmissorAtual;

    if ((!tipoEmissorValido || tipoFoiAlterado) && form.getFieldValue('idEmissor') != null) {
      form.setFieldValue('idEmissor', undefined);
    }

    tipoEmissorAnteriorRef.current = tipoEmissorAtual;
  }, [form, tipoEmissorWatch]);

  let campoEmissor = (
    <Col span={8} key='emissor-vazio'>
      <Form.Item
        label='Emissor'
        name='idEmissor'
        style={{ marginBottom: 0 }}
        rules={[{ required: valuePossuiCertificado === true, message: 'É necessário informar o Emissor' }]}
      >
        <Select placeholder='Selecione' disabled />
      </Form.Item>
    </Col>
  );

  if (tipoEmissorWatch === TipoEmissorEnum.DRE) {
    campoEmissor = (
      <Col span={8} key='dre-select'>
        <SelectDRE
          exibirOpcaoTodos={false}
          formItemProps={{
            label: 'Emissor',
            name: 'idEmissor',
            rules: [{ required: valuePossuiCertificado === true, message: 'É necessário informar o Emissor' }],
          }}
        />
      </Col>
    );
  } else if (tipoEmissorWatch === TipoEmissorEnum.Coordenadoria) {
    campoEmissor = (
      <Col span={8} key='coordenadoria-select'>
        <SelectCoordenadoria
          formItemProps={{
            label: 'Emissor',
            name: 'idEmissor',
            rules: [{ required: valuePossuiCertificado === true, message: 'É necessário informar o Emissor' }],
          }}
        />
      </Col>
    );
  }

  return (
    <Col>
      <Row gutter={[16, 16]}>
          <Col>
            <ButtonParecer campo={CampoConsideracaoEnum.cursoComCertificado}>
              <Form.Item
                label='Curso com certificação'
                name='cursoComCertificado'
                style={{ margin: 0 }}
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={obterPossuiCertificado}
                  value={valuePossuiCertificado}
                >
                  <Radio value={true}>Sim</Radio>
                  <Radio value={false}>Não</Radio>
                </Radio.Group>
              </Form.Item>
            </ButtonParecer>
          </Col>
          <Col flex='auto' />
          {valuePossuiCertificado === true && (
            <>
              <Col span={8}>
                <SelectTipoEmissor campoRequerido={valuePossuiCertificado === true} />
              </Col>
              {campoEmissor}
            </>
          )}
          <Col span={24}>
            <ButtonParecer campo={CampoConsideracaoEnum.criterioCertificacao}>
              <SelectCriterioCertificacao onchange={verificarCriteriosSelecionados} />
            </ButtonParecer>
          </Col>
          <Col span={24}>
            <ButtonParecer campo={CampoConsideracaoEnum.descricaoDaAtividade}>
              <EditorTexto
                nome='descricaoDaAtividade'
                label='Descrição da atividade obrigatória para certificação'
                required={editorRequerido}
                mensagemErro={DESCRICAO_DA_CERTIFICACAO_NAO_INFORMADA}
                exibirTooltip={editorRequerido}
                mensagemTooltip='Deve ser proposta ao menos uma atividade que será considerada na atribuição do conceito ao participante, na qual o cursista se posicione criticamente sobre suas ações ou experiências no exercício da sua atuação profissional. A atividade obrigatória deve atender a diversidade e as particularidades do público-alvo.'
                disabled={desabilitarCampos}
              />
            </ButtonParecer>
          </Col>
          <Col span={24}>
            <CheckboxAcaoInformatica />
          </Col>
      </Row>
    </Col>
  );
};

export default FormularioCertificacao;
