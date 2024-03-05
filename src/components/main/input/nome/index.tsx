import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
import { CF_INPUT_NOME } from '~/core/constants/ids/input';

type InputNomeProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

export const InputNome: React.FC<InputNomeProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label='Nome' name='nome' {...formItemProps}>
      <Input id={CF_INPUT_NOME} placeholder='Nome' {...inputProps} />
    </Form.Item>
  );
};
