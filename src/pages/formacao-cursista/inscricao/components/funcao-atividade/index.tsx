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
        const usuarioCargoSelecionado = form.getFieldsValue(true)?.usuarioCargoSelecionado;
        const usuarioCargos = form.getFieldsValue(true)?.usuarioCargos;

        const usuarioFuncoes: any = [];
        let options = [];

        if (usuarioCargoSelecionado) {
          const usuarioCargo = usuarioCargos?.find(
            (item: any) => item?.codigo === usuarioCargoSelecionado,
          );
          options = usuarioCargo?.funcoes?.length ? usuarioCargo?.funcoes : [];
        }

        if (usuarioFuncoes?.length) {
          options = usuarioFuncoes.map((item: any) => ({
            ...item,
            label: item.descricao,
            value: item.codigo,
          }));
        }

        return (
          <Form.Item
            {...formItemProps}
            label='Função/Atividade'
            name='usuarioFuncaoSelecionado'
            getValueFromEvent={(_, value) => value}
          >
            <Select
              allowClear
              labelInValue
              options={options}
              placeholder='Selecione uma Função/Atividade'
              id={CF_SELECT_FUNCAO_ATIVIDADE}
              {...selectProps}
            />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default SelectFuncaoAtividade;
