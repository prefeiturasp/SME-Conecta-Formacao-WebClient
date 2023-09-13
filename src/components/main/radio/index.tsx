import { Form, FormItemProps, Radio as RadioAnt, RadioGroupProps } from 'antd';

import React from 'react';

interface RadioProps {
  radioGroupProps: RadioGroupProps;
  formItemProps: FormItemProps;
  required?: boolean | true;
}

const Radio: React.FC<RadioProps> = ({ radioGroupProps, formItemProps, required = true }) => {
  return (
    <Form.Item rules={[{ required: required }]} {...formItemProps}>
      <RadioAnt.Group {...radioGroupProps} />
    </Form.Item>
  );
};

export default Radio;
