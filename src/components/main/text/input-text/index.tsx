import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputTextProps = {
  inputProps: InputProps;
  formItemProps?: FormItemProps;
};

const InputTexto: React.FC<InputTextProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item {...formItemProps}>
      <Input id='INPUT_TEXTO' {...inputProps} />
    </Form.Item>
  );
};

export default InputTexto;
