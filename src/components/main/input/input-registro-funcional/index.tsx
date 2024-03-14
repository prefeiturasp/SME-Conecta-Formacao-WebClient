import { Form, FormItemProps, Input, InputProps } from 'antd';
import { SearchProps } from 'antd/es/input';
import React from 'react';

type InputRegistroFuncionalProps = {
  inputProps?: InputProps;
  inputPropsSearch?: SearchProps;
  formItemProps?: FormItemProps;
  habilitarInputSearch?: boolean;
};

const InputRegistroFuncional: React.FC<InputRegistroFuncionalProps> = ({
  inputProps,
  formItemProps,
  inputPropsSearch,
  habilitarInputSearch,
}) => {
  const placeHolder = 'Registro Funcional (RF)';

  return (
    <Form.Item label='RF' name='registroFuncional' {...formItemProps}>
      {habilitarInputSearch ? (
        <Input.Search id='INPUT_RF' maxLength={7} placeholder={placeHolder} {...inputPropsSearch} />
      ) : (
        <Input id='INPUT_RF' maxLength={7} placeholder={placeHolder} {...inputProps} />
      )}
    </Form.Item>
  );
};

export default InputRegistroFuncional;
