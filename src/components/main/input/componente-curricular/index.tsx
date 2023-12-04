import { Col, Form, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_INPUT_COMPONENTE_CURRICULAR_TODOS } from '~/core/constants/ids/input';
import { CF_SELECT_COMPONENTE_CURRICULAR } from '~/core/constants/ids/select';
import { obterComponenteCurricular } from '~/core/services/proposta-service';
import { validarOnChangeMultiSelectOutros } from '~/core/utils/functions';

const SelectComponenteCurricular: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterComponenteCurricular();
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
        const componenteCurricular: number[] = form.getFieldValue('componenteCurricular');

        let campoTodos = null;

        if (componenteCurricular?.length) {
          const ehTodos = options.some(
            (option: any) => componenteCurricular.includes(option.value) && option.outros,
          );

          if (ehTodos) {
            campoTodos = (
              <Form.Item
                label='Todos'
                name='componenteCurricularTodos'
                rules={[{ required: true }]}
              >
                <Input
                  type='text'
                  maxLength={100}
                  placeholder='Todos'
                  id={CF_INPUT_COMPONENTE_CURRICULAR_TODOS}
                />
              </Form.Item>
            );
          }
        }

        return (
          <>
            <Col span={24}>
              <Form.Item label='Componente Curricular' name='componenteCurricular'>
                <Select
                  allowClear
                  mode='multiple'
                  options={options}
                  placeholder='Componente Curricular'
                  id={CF_SELECT_COMPONENTE_CURRICULAR}
                  onChange={(value) => {
                    const values = validarOnChangeMultiSelectOutros(value, componenteCurricular);
                    form.setFieldValue('componenteCurricular', values);
                    form.setFieldValue('componenteCurricularTodos', '');
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

export default SelectComponenteCurricular;
