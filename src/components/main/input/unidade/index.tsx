import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputUnidadeProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputUnidade: React.FC<InputUnidadeProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item
      label='Nome da Unidade'
      name='nomeUnidade'
      rules={[{ required: !!formItemProps?.required }]}
      {...formItemProps}
    >
      <Input autoComplete='off' maxLength={100} id='INPUT_UNIDADE' {...inputProps} />
    </Form.Item>
  );
};

export default InputUnidade;
