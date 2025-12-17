import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_SITUACAO_INSCRICAO } from '~/core/constants/ids/select';
import { SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';

type SelectSituacaoInscricaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSituacaoInscricao: React.FC<SelectSituacaoInscricaoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const options: DefaultOptionType[] = Object.entries(SituacaoInscricaoTagDisplay).map(
    ([key, value]) => ({
      label: value,
      value: Number(key),
    }),
  );

  return (
    <Form.Item
      label='Situação'
      name='situacaoInscricao'
      rules={[{ required: false }]}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        options={options}
        placeholder='Selecione'
        id={CF_SELECT_SITUACAO_INSCRICAO}
      />
    </Form.Item>
  );
};

export default SelectSituacaoInscricao;
