import { Form, FormItemProps, Input } from 'antd';
import React from 'react';
import { CF_INPUT_AREA_TEXTO } from '~/core/constants/ids/input';

type InputTextAreaProps = {
  formItemProps?: FormItemProps;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  podeEditar?: boolean;
  value?: string;
};

const { TextArea } = Input;

const AreaTexto: React.FC<InputTextAreaProps> = ({
  formItemProps,
  rows = 10,
  placeholder,
  maxLength,
  onChange,
  podeEditar = true,
  value
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
        disabled={ !podeEditar }
        value={ value }
      />
    </Form.Item>
  );
};

export default AreaTexto;
