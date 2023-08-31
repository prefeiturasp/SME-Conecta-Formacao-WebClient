import { Form, FormItemProps, Radio as RadioAnt, RadioChangeEvent } from 'antd';

import React, { useState } from 'react';

interface RadioProps {
  dados: Array<{ value: number; label: string }>;
  formItemProps: FormItemProps;
}

const Radio: React.FC<RadioProps> = ({ dados, formItemProps }) => {
  const [value, setValue] = useState(1);

  const onChangeTipoFormacao = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Form.Item {...formItemProps} rules={[{ required: true }]}>
      <RadioAnt.Group onChange={onChangeTipoFormacao} value={value} defaultValue={value}>
        {dados.map((option: any) => (
          <RadioAnt key={option.value} value={option.value}>
            {option.label}
          </RadioAnt>
        ))}
      </RadioAnt.Group>
    </Form.Item>
  );
};

export default Radio;
