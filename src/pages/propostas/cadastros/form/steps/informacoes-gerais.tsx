import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Divider, Form, Input, Row, Select, SelectProps, Tooltip } from 'antd';

import React, { useState } from 'react';
import Empty from '~/components/main/empty';
import InputNumero from '~/components/main/numero';
import Radio from '~/components/main/radio';
import SelectMultiple from '~/components/main/select';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';
import { Colors } from '~/core/styles/colors';

interface FormInformacoesGeraisProps {
  totalVagas: string;
}

const FormInformacoesGerais: React.FC<FormInformacoesGeraisProps> = ({ totalVagas }) => {
  const [mostrarInputFuncaoEspecifica, setMostrarInputFuncaoEspecifica] = useState<boolean>(false);

  const tipoFormacao = [
    { label: 'Curso', value: 1 },
    { label: 'Evento', value: 2 },
  ];

  const tipoInscricao = [
    { label: 'Optativa', value: 1 },
    { label: 'Automática', value: 2 },
  ];

  const options: SelectProps['options'] = [];

  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

  return (
    <Col span={24} style={{ margin: '51px 0' }}>
      <Row gutter={16} justify={'start'}>
        <Col span={8}>
          <Radio
            formItemProps={{
              name: 'tipoFormacao',
              label: 'Tipo de formação',
            }}
            dados={tipoFormacao}
          />
        </Col>
        <Col span={8}>
          <Form.Item
            key='modalidade'
            name='modalidade'
            label='Modalidade'
            rules={[{ required: true }]}
            tooltip={{
              title:
                'Para propostas de formações a distância é obrigatório conter o mínimo de 20% e máximo de 40% em atividades presenciais ou aulas síncronas.',
              icon: (
                <Tooltip>
                  <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                </Tooltip>
              ),
            }}
          >
            <Select placeholder='Modalidade' allowClear notFoundContent={<Empty />}>
              {/* {listaTipos?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.nome}
                    </Option>
                  );
                })} */}
            </Select>
          </Form.Item>
        </Col>
        <Col offset={3}>
          <Radio
            formItemProps={{
              name: 'tipoInscricao',
              label: 'Tipo de inscrição',
            }}
            dados={tipoInscricao}
          />
        </Col>
      </Row>
      <Col>
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
            id={CF_INPUT_NOME}
            placeholder='Escreva o título da formação'
          />
        </Form.Item>
      </Col>
      <Col>
        <SelectMultiple
          formItemProps={{
            name: 'publicoAlvo',
            label: 'Público alvo',
            rules: [{ required: true }],
            tooltip: {
              title: 'Indicar somente aqueles que têm relação com o tema e objetivos da formação.',
              icon: (
                <Tooltip>
                  <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                </Tooltip>
              ),
            },
          }}
          selectProps={{
            options: options,
            placeholder: 'Público alvo',
          }}
        />
      </Col>
      <Col>
        <SelectMultiple
          formItemProps={{
            name: 'funcaoEspecifica',
            label: 'Função específica',
            tooltip: {
              title:
                'O curso/evento é SOMENTE para o servidor que esteja exercendo alguma função específica? Em caso afirmativo, identifique a função (Ex: Prof. de Matemática; Diretor de CEI; Prof. Regente no Ciclo de Alfabetização; POED, outros).',
              icon: (
                <Tooltip>
                  <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                </Tooltip>
              ),
            },
          }}
          selectProps={{
            options: options,
            placeholder: 'Função específica',
            // Caso seja selecionada a opção "Outros" deverá ser disponibilizado um campo obrigatório de 100 caracteres.
            onChange(value, _option) {
              value.includes('g16') && setMostrarInputFuncaoEspecifica(true);
            },
            dropdownRender(menu) {
              return (
                <>
                  {menu}
                  {mostrarInputFuncaoEspecifica && (
                    <>
                      <Divider />
                      <Input type='text' maxLength={100} placeholder='Função específica' />
                    </>
                  )}
                </>
              );
            },
          }}
        />
      </Col>
      <Row gutter={24} justify={'space-between'}>
        <Col span={12}>
          <SelectMultiple
            formItemProps={{
              name: 'criteriosValidacaoInscricoes',
              label: 'Critérios para validação das inscrições',
              rules: [{ required: true }],
            }}
            selectProps={{
              options: options,
              placeholder: 'Critérios para validação das inscrições',
            }}
          />
        </Col>
        <Col span={12}>
          <SelectMultiple
            formItemProps={{
              name: 'vagasRemanescentes',
              label: 'Em caso de vagas remanescentes',
              tooltip: {
                title:
                  'Havendo vagas remanescentes, poderão ser contemplados os seguintes cargos e/ou funções como público-alvo.',
                icon: (
                  <Tooltip>
                    <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                  </Tooltip>
                ),
              },
            }}
            selectProps={{
              options: options,
              placeholder: 'Em caso de vagas remanescentes',
            }}
          />
        </Col>
      </Row>
      <Row gutter={24} justify={'space-between'}>
        <Col span={8}>
          <InputNumero
            formItemProps={{
              label: 'Quantidade de turmas',
              name: 'quantidadeTurmas',
              rules: [{ required: true }],
            }}
            inputProps={{ id: '', placeholder: 'Quantidade de turmas', maxLength: 3 }}
          />
        </Col>
        <Col span={8}>
          <InputNumero
            formItemProps={{
              label: 'Vagas por turma',
              name: 'vagasTurma',
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
            inputProps={{ id: '', placeholder: 'Vagas por turma', maxLength: 4 }}
          />
        </Col>
        <Col span={8}>
          <InputNumero
            formItemProps={{
              label: 'Total de vagas',
              name: 'totalVagas',
            }}
            inputProps={{ id: '', placeholder: totalVagas, disabled: true }}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default FormInformacoesGerais;
