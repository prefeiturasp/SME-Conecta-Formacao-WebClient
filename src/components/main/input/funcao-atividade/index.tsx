import { Form, FormItemProps } from 'antd';
import { SelectProps } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_FUNCAO_ATIVIDADE } from '~/core/constants/ids/select';

type SelectFuncaoAtividadeProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectFuncaoAtividade: React.FC<SelectFuncaoAtividadeProps> = ({
  selectProps,
  formItemProps,
}) => {
  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const usuarioCargos = form.getFieldValue('usuarioCargos');

        let options = usuarioCargos?.funcoes ? usuarioCargos?.funcoes : [];

        if (options?.length) {
          options = options.map((item: any) => ({
            ...item,
            label: item.descricao,
            value: item.codigo,
          }));
        }

        return (
          <Form.Item label='Função/Atividade' name='usuarioFuncoes' {...formItemProps}>
            <Select
              allowClear
              options={options}
              placeholder='Selecione uma Função/Atividade'
              {...selectProps}
              id={CF_SELECT_FUNCAO_ATIVIDADE}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default SelectFuncaoAtividade;
