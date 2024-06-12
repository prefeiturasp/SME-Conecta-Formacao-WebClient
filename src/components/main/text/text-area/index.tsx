import { Form, FormItemProps, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import React from 'react';
import { CF_INPUT_AREA_TEXTO } from '~/core/constants/ids/input';

type InputTextAreaProps = {
  formItemProps?: FormItemProps;
  textAreaProps?: TextAreaProps;
};

const { TextArea } = Input;

const AreaTexto: React.FC<InputTextAreaProps> = ({ formItemProps, textAreaProps }) => {
  return (
    <Form.Item {...formItemProps}>
      <TextArea
        rows={10}
        maxLength={1000}
        id={CF_INPUT_AREA_TEXTO}
        style={{ resize: 'none' }}
        {...textAreaProps}
      />
    </Form.Item>
  );
};

export default AreaTexto;
