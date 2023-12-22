import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';

type InputRegistroFuncionalProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputRegistroFuncional: React.FC<InputRegistroFuncionalProps> = ({
  inputProps,
  formItemProps,
}) => {
  return (
    <Form.Item label='RF' name='registroFuncional' {...formItemProps}>
      <Input id='INPUT_RF' maxLength={7} placeholder='Registro Funcional (RF)' {...inputProps} />
    </Form.Item>
  );
};

export default InputRegistroFuncional;
