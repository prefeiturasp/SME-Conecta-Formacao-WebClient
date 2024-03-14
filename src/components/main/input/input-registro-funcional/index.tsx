import { Form, FormItemProps, Input, InputProps } from 'antd';
import { SearchProps } from 'antd/es/input';
import React from 'react';

type InputRegistroFuncionalProps = {
  inputProps?: InputProps & SearchProps;
  formItemProps?: FormItemProps;
  habilitarInputSearch?: boolean;
};

const InputRegistroFuncional: React.FC<InputRegistroFuncionalProps> = ({
  inputProps,
  formItemProps,
  habilitarInputSearch,
}) => {
  const placeHolder = 'Registro Funcional (RF)';
  const InputComponent = habilitarInputSearch ? Input.Search : Input;

  return (
    <Form.Item label='RF' name='registroFuncional' {...formItemProps}>
      <InputComponent id='INPUT_RF' maxLength={7} placeholder={placeHolder} {...inputProps} />
    </Form.Item>
  );
};

export default InputRegistroFuncional;
