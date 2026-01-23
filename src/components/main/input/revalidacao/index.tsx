import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_REVALIDACAO } from '~/core/constants/ids/select';

type SelectRevalidacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  onRevalidacaoChange?: (value: boolean) => void;
};

const SelectRevalidacao: React.FC<SelectRevalidacaoProps> = ({
  selectProps,
  formItemProps,
  onRevalidacaoChange,
}) => {
  const options: DefaultOptionType[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];

  const handleChange = (value: string) => {
    onRevalidacaoChange?.(value === 'true');
    selectProps?.onChange?.(value, options);
  };

  return (
    <Form.Item
      label='Revalidação'
      name='revalidacao'
      rules={[{ required: false }]}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        onChange={handleChange}
        options={options}
        placeholder='Revalidação'
        id={CF_SELECT_REVALIDACAO}
      />
    </Form.Item>
  );
};

export default SelectRevalidacao;
