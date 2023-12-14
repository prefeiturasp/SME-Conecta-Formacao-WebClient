import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_COMPONENTE_CURRICULAR } from '~/core/constants/ids/select';
import { obterComponenteCurricular } from '~/core/services/componentes-curriculares-service';
import { onchangeMultiSelectOpcaoTodos } from '~/core/utils/functions';

type SelectComponenteCurricularProps = {
  exibirOpcaoTodos?: boolean;
};

const SelectComponenteCurricular: React.FC<SelectComponenteCurricularProps> = ({
  exibirOpcaoTodos = true,
}) => {
  const form = useFormInstance();
  const anosTurmas = Form.useWatch('anosTurmas', form);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterComponenteCurricular(anosTurmas, exibirOpcaoTodos);

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.descricao,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (anosTurmas?.length) obterDados();
  }, [anosTurmas]);

  useEffect(() => {
    if (form.isFieldTouched('modalidades')) {
      form.setFieldValue('componentesCurriculares', []);
      setOptions([]);
    }
  }, [form, anosTurmas]);

  return (
    <Form.Item
      label='Componente Curricular'
      name='componentesCurriculares'
      normalize={(value: number[], prevValue: number[]) => {
        if (exibirOpcaoTodos) {
          const opcaoTodos = options.find((item) => !!item.todos);

          const valorTodosComparacao = opcaoTodos?.value;

          const newValue = onchangeMultiSelectOpcaoTodos(value, prevValue, valorTodosComparacao);

          return newValue;
        }

        return value;
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Componente Curricular'
        id={CF_SELECT_COMPONENTE_CURRICULAR}
      />
    </Form.Item>
  );
};

export default SelectComponenteCurricular;
