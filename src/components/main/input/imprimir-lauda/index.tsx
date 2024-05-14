import { FormItemProps, RadioGroupProps } from 'antd';
import React from 'react';
import { CF_RADIO_SIM_NAO } from '~/core/constants/ids/radio';
import Radio from '../../radio';

interface RadioRelatorioLaudaProps {
  formItemProps: FormItemProps;
  radioGroupProps?: RadioGroupProps;
}

export const RadioRelatorioLauda: React.FC<RadioRelatorioLaudaProps> = ({
  formItemProps,
  radioGroupProps,
}) => {
  const options: RadioGroupProps['options'] = [
    { label: 'Lauda de publicação', value: true },
    { label: 'Lauda completa', value: false },
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
