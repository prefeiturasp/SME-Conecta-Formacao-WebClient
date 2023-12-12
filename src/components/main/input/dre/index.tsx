import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_DRE } from '~/core/constants/ids/select';
import { obterDREs } from '~/core/services/dre-service';
import { onchangeMultiSelectOpcaoTodos } from '~/core/utils/functions';

interface SelectDREProps {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  exibirOpcaoTodos?: boolean;
}

export const SelectDRE: React.FC<SelectDREProps> = ({
  formItemProps,
  selectProps,
  exibirOpcaoTodos,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDRE = async () => {
    const resposta = await obterDREs(exibirOpcaoTodos);

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.descricao,
        value: item.id,
      }));
      setOptions(newOptions);
    }
  };

  useEffect(() => {
    obterDRE();
  }, []);

  return (
    <Form.Item
      label='DRE'
      key='dreId'
      name='dreId'
      rules={[{ required: true }]}
      normalize={(value: number[], prevValue: number[]) => {
        if (exibirOpcaoTodos) {
          const opcaoTodos = options.find((item) => !!item.todos);

          const valorTodosComparacao = opcaoTodos?.value;

          const newValue = onchangeMultiSelectOpcaoTodos(value, prevValue, valorTodosComparacao);

          return newValue;
        }

        return value;
      }}
      {...formItemProps}
    >
      <Select {...selectProps} options={options} id={CF_SELECT_DRE} placeholder='Selecione a DRE' />
    </Form.Item>
  );
};
