import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_REVALIDACAO } from '~/core/constants/ids/select';

type SelectRevalidacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectRevalidacao: React.FC<SelectRevalidacaoProps> = ({ selectProps, formItemProps }) => {
  const options: DefaultOptionType[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];

  return (
    <Form.Item
      label='Revalidação'
      name='revalidacao'
      rules={[{ required: false }]}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        options={options}
        placeholder='Revalidação'
        id={CF_SELECT_REVALIDACAO}
      />
    </Form.Item>
  );
};

export default SelectRevalidacao;
