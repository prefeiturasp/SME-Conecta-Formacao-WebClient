import { Col, Form, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_INPUT_ANO_ETAPA_TODOS } from '~/core/constants/ids/input';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';
import { obterAnoEtapa } from '~/core/services/proposta-service';
import { validarOnChangeMultiSelectOutros } from '~/core/utils/functions';

const SelectAnoEtapa: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterAnoEtapa();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
        todos: item.todos,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const anoEtapa: number[] = form.getFieldValue('anoEtapa');

        let campoTodos = null;

        if (anoEtapa?.length) {
          const ehTodos = options.some(
            (option: any) => anoEtapa.includes(option.value) && option.outros,
          );

          if (ehTodos) {
            campoTodos = (
              <Form.Item label='Todos' name='anoEtapaTodos' rules={[{ required: true }]}>
                <Input
                  type='text'
                  maxLength={100}
                  placeholder='Todos'
                  id={CF_INPUT_ANO_ETAPA_TODOS}
                />
              </Form.Item>
            );
          }
        }

        return (
          <>
            <Col span={24}>
              <Form.Item label='Ano/Etapa' name='anoEtapa'>
                <Select
                  allowClear
                  mode='multiple'
                  options={options}
                  placeholder='Ano/Etapa'
                  id={CF_SELECT_ANO_ETAPA}
                  onChange={(value) => {
                    const values = validarOnChangeMultiSelectOutros(value, anoEtapa);
                    form.setFieldValue('anoEtapa', values);
                    form.setFieldValue('anoEtapaTodos', '');
                  }}
                />
              </Form.Item>
            </Col>
            {campoTodos ? <Col span={24}>{campoTodos}</Col> : <></>}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectAnoEtapa;
