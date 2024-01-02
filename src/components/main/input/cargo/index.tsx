import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CARGO } from '~/core/constants/ids/select';
import { obterDadosInscricao } from '~/core/services/inscricao-service';

type SelectCargoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectCargo: React.FC<SelectCargoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterDadosInscricao();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.usuarioCargos.map((item: any) => ({
        label: item.descricao,
        value: item.codigo,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Cargo' name='cargos' {...formItemProps}>
      <Select
        allowClear
        options={options}
        placeholder='Selecione um cargo'
        {...selectProps}
        id={CF_SELECT_CARGO}
      />
    </Form.Item>
  );
};

export default SelectCargo;
