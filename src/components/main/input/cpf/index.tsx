import { Form, FormItemProps, Input, InputProps } from 'antd';
import { SearchProps } from 'antd/es/input';
import React from 'react';
import { CPF_NAO_INFORMADO } from '~/core/constants/mensagens';
import { removerTudoQueNaoEhDigito } from '~/core/utils/functions/index';

type InputCPFProps = {
  inputProps?: InputProps;
  inputPropsSearch?: SearchProps;
  formItemProps?: FormItemProps;
  habilitarInputSearch?: boolean;
};

const InputCPF: React.FC<InputCPFProps> = ({
  inputProps,
  formItemProps,
  habilitarInputSearch,
  inputPropsSearch,
}) => {
  const formatterCPFMask = (value: string | number | undefined) =>
    `${value}`
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? formatterCPFMask(value) : value;
  };

  return (
    <Form.Item
      label='CPF'
      name='cpf'
      {...formItemProps}
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: !!formItemProps?.required, message: CPF_NAO_INFORMADO },
        {
          message: 'Deve conter 11 caracteres',
          validator: (_: any, value: string) => {
            const valorValidar = removerTudoQueNaoEhDigito(value);

            if (!valorValidar) return Promise.resolve();

            if (/^[0-9]{11}/.test(valorValidar)) return Promise.resolve();

            return Promise.reject();
          },
        },
      ]}
    >
      {habilitarInputSearch ? (
        <Input.Search placeholder='Informe o CPF' {...inputPropsSearch} />
      ) : (
        <Input placeholder='Informe o CPF' {...inputProps} />
      )}
    </Form.Item>
  );
};

export default InputCPF;
