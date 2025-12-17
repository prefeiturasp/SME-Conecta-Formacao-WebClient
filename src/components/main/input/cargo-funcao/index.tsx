import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CARGO_FUNCAO } from '~/core/constants/ids/select';
import { obterCargosFuncoes } from '~/core/services/cargo-funcao-service';

type SelectCargoFuncaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCargoFuncao: React.FC<SelectCargoFuncaoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterCargosFuncoes();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item
      label='Cargo/Função Atividade'
      name='cargoFuncaoId'
      rules={[{ required: false }]}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        options={options}
        placeholder='Selecione'
        id={CF_SELECT_CARGO_FUNCAO}
      />
    </Form.Item>
  );
};

export default SelectCargoFuncao;
