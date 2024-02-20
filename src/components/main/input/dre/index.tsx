import { Form, FormItemProps, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_DRE } from '~/core/constants/ids/select';
import { PROPOSTA_DRE_NAO_INFORMADA } from '~/core/constants/mensagens';
import { obterDREs } from '~/core/services/dre-service';
import {
  onchangeMultiSelectLabelInValueOpcaoTodos,
  onchangeMultiSelectOpcaoTodos,
} from '~/core/utils/functions';

interface SelectDREProps {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  exibirOpcaoTodos?: boolean;
  carregarDadosAutomaticamente?: boolean;
}

export const SelectDRE: React.FC<SelectDREProps> = ({
  formItemProps,
  selectProps,
  exibirOpcaoTodos,
  carregarDadosAutomaticamente = true,
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
    if (carregarDadosAutomaticamente) {
      obterDRE();
    }
  }, [carregarDadosAutomaticamente]);

  return (
    <Form.Item
      label='DRE'
      key='dreId'
      name='dreId'
      rules={[{ required: true, message: PROPOSTA_DRE_NAO_INFORMADA }]}
      getValueFromEvent={(_, value) => value}
      normalize={(value: number[], prevValue: number[]) => {
        const dres = carregarDadosAutomaticamente ? options : selectProps?.options;

        if (selectProps?.mode === 'multiple' && exibirOpcaoTodos && dres?.length) {
          const opcaoTodos = dres.find((item) => !!item.todos);

          const valorTodosComparacao = opcaoTodos?.value;

          if (selectProps?.labelInValue) {
            const newValue = onchangeMultiSelectLabelInValueOpcaoTodos(
              value,
              prevValue,
              valorTodosComparacao,
            );

            return newValue;
          }

          const listaNumeros = selectProps?.labelInValue
            ? value.map((item: any) => item.value)
            : value;

          const newValue = onchangeMultiSelectOpcaoTodos(
            listaNumeros,
            prevValue,
            valorTodosComparacao,
          );

          return newValue;
        }

        return value;
      }}
      {...formItemProps}
    >
      <Select options={options} id={CF_SELECT_DRE} placeholder='Selecione a DRE' {...selectProps} />
    </Form.Item>
  );
};
