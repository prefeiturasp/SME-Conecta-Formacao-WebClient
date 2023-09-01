import { Form, FormItemProps, Radio as RadioAnt, RadioGroupProps } from 'antd';

import React from 'react';

interface RadioProps {
  radioGroupProps: RadioGroupProps;
  formItemProps: FormItemProps;
}

const Radio: React.FC<RadioProps> = ({ radioGroupProps, formItemProps }) => {
  return (
    <Form.Item rules={[{ required: true }]} {...formItemProps}>
      <RadioAnt.Group {...radioGroupProps} />
    </Form.Item>
  );
};

export default Radio;
