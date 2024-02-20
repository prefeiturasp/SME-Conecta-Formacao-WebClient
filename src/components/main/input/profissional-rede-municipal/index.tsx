import { FormItemProps, RadioGroupProps } from 'antd';
import React from 'react';
import { CF_RADIO_SIM_NAO } from '~/core/constants/ids/radio';
import Radio from '../../radio';

interface RadioSimNaoProps {
  formItemProps: FormItemProps;
  radioGroupProps?: RadioGroupProps;
}

const RadioSimNao: React.FC<RadioSimNaoProps> = ({ formItemProps, radioGroupProps }) => {
  const options: RadioGroupProps['options'] = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  return (
    <Radio
      formItemProps={formItemProps}
      radioGroupProps={{
        ...radioGroupProps,
        id: CF_RADIO_SIM_NAO,
        options,
      }}
    />
  );
};

export default RadioSimNao;
