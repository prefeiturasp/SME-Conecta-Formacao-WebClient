import { Form, FormItemProps, Input } from 'antd';
import React from 'react';
import { CF_INPUT_AREA_TEXTO } from '~/core/constants/ids/input';

type InputTextProps = {
  formItemProps?: FormItemProps;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const { TextArea } = Input;

const AreaTexto: React.FC<InputTextProps> = ({
  formItemProps,
  rows = 10,
  placeholder,
  maxLength,
  onChange
}) => {
  return (
    <Form.Item {...formItemProps}>
      <TextArea
        id={ CF_INPUT_AREA_TEXTO }
        rows={ rows }
        placeholder={ placeholder }
        maxLength={ maxLength }
        style={{ resize: 'none' }}
        onChange={ onChange }
      />
    </Form.Item>
  );
};

export default AreaTexto;
