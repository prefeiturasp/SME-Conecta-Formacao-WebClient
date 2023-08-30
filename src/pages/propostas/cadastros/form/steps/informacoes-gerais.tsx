import { Col, Form, Input, Row, Select, SelectProps } from 'antd';

import React from 'react';
import Empty from '~/components/main/empty';
import InputNumero from '~/components/main/numero';
import Radio from '~/components/main/radio';
import SelectMultiple from '~/components/main/select';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';

interface FormInformacoesGeraisProps {
  totalVagas: string;
}

const FormInformacoesGerais: React.FC<FormInformacoesGeraisProps> = ({ totalVagas }) => {
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
          }}
          selectProps={{
            options: options,
            placeholder: 'Função específica',
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
