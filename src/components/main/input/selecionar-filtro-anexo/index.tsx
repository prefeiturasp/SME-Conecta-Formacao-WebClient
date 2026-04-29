import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_FORMACAO_COM_ANEXO } from '~/core/constants/ids/select';

type SelectFormacaoComAnexoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  onChange?: (value: boolean | undefined) => void;
};

const SelectFormacaoComAnexo: React.FC<SelectFormacaoComAnexoProps> = ({
  selectProps,
  formItemProps,
  onChange,
}) => {
  const options: DefaultOptionType[] = [
    { label: 'Todas', value: null },
    { label: 'Com anexos', value: 'true' },
    { label: 'Sem anexos', value: 'false' },
  ];

  const handleChange = (value?: string) => {
    let parsed: boolean | undefined;

    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else parsed = undefined;

    onChange?.(parsed);
  };

  return (
    <Form.Item
      label="Formação com anexos?"
      name="possuiAnexo"
      rules={[{ required: false }]}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        allowClear
        onChange={handleChange}
        options={options}
        placeholder="Selecione"
        id={CF_SELECT_FORMACAO_COM_ANEXO}
      />
    </Form.Item>
  );
};

export default SelectFormacaoComAnexo;