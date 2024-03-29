import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_SITUACAO } from '~/core/constants/ids/select';
import { obterSituacoes } from '~/core/services/proposta-service';

type SelectSituacaoPropostaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectSituacaoProposta: React.FC<SelectSituacaoPropostaProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterSituacoes();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Situação' name='situacao' rules={[{ required: false }]} {...formItemProps}>
      <Select {...selectProps} options={options} placeholder='Situação' id={CF_SELECT_SITUACAO} />
    </Form.Item>
  );
};

export default SelectSituacaoProposta;
