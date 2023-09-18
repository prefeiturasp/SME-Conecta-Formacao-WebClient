import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Form, FormInstance, Input, Row, Tooltip } from 'antd';

import React from 'react';
import SelectCriteriosValidacaoInscricoes from '~/components/main/input/criterios-validacao-inscricoes';
import SelectFuncaoEspecifica from '~/components/main/input/funcao-especifica';
import SelectModalidades from '~/components/main/input/modalidades';
import { default as SelectPublicoAlvo } from '~/components/main/input/publico-alvo';
import RadioTipoInscricao from '~/components/main/input/tipo-Inscricao';
import RadioTipoFormacao from '~/components/main/input/tipo-formacao';
import SelectVagasRemanescentes from '~/components/main/input/vagas-remanescentes';
import InputNumero from '~/components/main/numero';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_QUANTIDADE_TURMAS,
  CF_INPUT_QUANTIDADE_VAGAS_TURMA,
  CF_INPUT_TOTAL_VAGAS,
} from '~/core/constants/ids/input';
import { Colors } from '~/core/styles/colors';

type FormInformacoesGeraisProps = {
  form: FormInstance;
};

const FormInformacoesGerais: React.FC<FormInformacoesGeraisProps> = ({ form }) => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={10} md={7} lg={6} xl={4}>
        <RadioTipoFormacao />
      </Col>

      <Col xs={24} sm={14} md={7} lg={11} xl={15}>
        <SelectModalidades form={form} />
      </Col>

      <Col xs={24} sm={10} md={9} lg={7} xl={5}>
        <RadioTipoInscricao />
      </Col>

      <Col xs={24} sm={14} md={24}>
        <Form.Item
          key='nomeFormacao'
          name='nomeFormacao'
          label='Nome da formação'
          tooltip={{
            title:
              'O título da formação deve apresentar de forma sucinta a ideia central do tema que será tratado, indicando ao cursista a macro área do tema e a especificidade do curso proposto.',
            icon: (
              <Tooltip>
                <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
              </Tooltip>
            ),
          }}
          rules={[{ required: true, whitespace: true }]}
        >
          <Input
            type='text'
            maxLength={150}
            id={CF_INPUT_NOME_FORMACAO}
            placeholder='Escreva o título da formação'
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <SelectPublicoAlvo />
      </Col>

      <Col span={24}>
        <SelectFuncaoEspecifica />
      </Col>

      <Col xs={24}>
        <SelectCriteriosValidacaoInscricoes />
      </Col>

      <Col xs={24}>
        <SelectVagasRemanescentes />
      </Col>

      <Col xs={24} sm={12} md={8}>
        <InputNumero
          formItemProps={{
            label: 'Quantidade de turmas',
            name: 'quantidadeTurmas',
            rules: [{ required: true }],
          }}
          inputProps={{
            id: CF_INPUT_QUANTIDADE_TURMAS,
            placeholder: 'Quantidade de turmas',
            maxLength: 3,
          }}
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <InputNumero
          formItemProps={{
            label: 'Vagas por turma',
            name: 'quantidadeVagasTurma',
            rules: [{ required: true }],
            tooltip: {
              title:
                'Tanto nos cursos presenciais, quanto nos cursos a distância, a proporção máxima aceita será de 50 (cinquenta) cursistas por turma/tutor. Nos eventos presenciais, a quantidade de participantes poderá se adequar à capacidade do espaço. Nos eventos a distância/híbridos, a proporção máxima aceita será de 200 (duzentas) pessoas, sendo a proporção máxima de um tutor para 50 (cinquenta) participantes.',
              icon: (
                <Tooltip>
                  <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                </Tooltip>
              ),
            },
          }}
          inputProps={{
            id: CF_INPUT_QUANTIDADE_VAGAS_TURMA,
            placeholder: 'Vagas por turma',
            maxLength: 4,
          }}
        />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Form.Item shouldUpdate>
          {(form) => {
            const quantidadeTurmas = form.getFieldValue('quantidadeTurmas') || 0;
            const quantidadeVagasTurma = form.getFieldValue('quantidadeVagasTurma') || 0;

            const totalVagas = quantidadeTurmas * quantidadeVagasTurma;

            return (
              <InputNumero
                formItemProps={{
                  label: 'Total de vagas',
                }}
                inputProps={{
                  id: CF_INPUT_TOTAL_VAGAS,
                  value: totalVagas?.toString(),
                  disabled: true,
                }}
              />
            );
          }}
        </Form.Item>
      </Col>
      <Col span={24}>
        <UploadArquivosConectaFormacao
          form={form}
          formItemProps={{
            name: 'arquivos',
            label: 'Imagem de divulgação',
            rules: [{ required: true }],
          }}
          draggerProps={{ multiple: false, maxCount: 1 }}
        />
      </Col>
    </Row>
  );
};

export default FormInformacoesGerais;
