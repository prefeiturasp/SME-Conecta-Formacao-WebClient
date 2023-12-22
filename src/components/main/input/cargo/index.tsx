import { Form } from 'antd';
import { FormItemInputProps } from 'antd/es/form/FormItemInput';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_CRONOGRAMA } from '~/core/constants/ids/select';

type SelectCargoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemInputProps;
  serviceAPI?: any;
};

const SelectCargo: React.FC<SelectCargoProps> = ({ selectProps, formItemProps, serviceAPI }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await serviceAPI();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: any) => ({
        label: item.descricao,
        value: item.id,
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
    <Form.Item
      label='Cargo'
      name='cargo'
      rules={[{ message: 'Selecione um cargo' }]}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Selecione um cargo'
        {...selectProps}
        id={CF_SELECT_TURMA_CRONOGRAMA}
      />
    </Form.Item>
  );
};

export default SelectCargo;
