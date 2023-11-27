import { FormItemProps, RadioGroupProps } from 'antd';
import React from 'react';
import Radio from '~/components/main/radio';
import { CF_RADIO_PARECER } from '~/core/constants/ids/radio';
import { SituacaoRegistro, SituacaoRegistroTagDisplay } from '~/core/enum/situacao-registro';

type RadioParecerProps = {
  formItemProps: FormItemProps;
  radioGroupProps?: RadioGroupProps;
};

const RadioParecer: React.FC<RadioParecerProps> = ({ formItemProps, radioGroupProps }) => {
  const options: RadioGroupProps['options'] = [
    {
      label: SituacaoRegistroTagDisplay[SituacaoRegistro.Favoravel],
      value: SituacaoRegistro.Favoravel,
    },
    {
      label: SituacaoRegistroTagDisplay[SituacaoRegistro.Desfavoravel],
      value: SituacaoRegistro.Desfavoravel,
    },
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
