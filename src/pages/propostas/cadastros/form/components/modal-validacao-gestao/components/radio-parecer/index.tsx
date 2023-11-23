import { FormItemProps, RadioGroupProps } from 'antd';
import React from 'react';
import Radio from '~/components/main/radio';
import { CF_RADIO_PARECER } from '~/core/constants/ids/radio';
import { SituacaoRegistro } from '~/core/enum/situacao-registro';

type RadioParecerProps = {
  formItemProps: FormItemProps;
  radioGroupProps?: RadioGroupProps;
};

const RadioParecer: React.FC<RadioParecerProps> = ({ formItemProps, radioGroupProps }) => {
  const options: RadioGroupProps['options'] = [
    { label: 'Farorável', value: SituacaoRegistro.Favoravel },
    { label: 'Desfavorável', value: SituacaoRegistro.Desfavoravel },
  ];

  return (
    <Radio
      formItemProps={formItemProps}
      radioGroupProps={{
        ...radioGroupProps,
        id: CF_RADIO_PARECER,
        options,
      }}
    />
  );
};

export default RadioParecer;
