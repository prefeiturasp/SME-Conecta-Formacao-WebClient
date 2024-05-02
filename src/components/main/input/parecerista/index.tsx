import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PARECERISTA } from '~/core/constants/ids/select';
import { obterPareceristas } from '~/core/services/funcionario-service';

type SelectPareceristasProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectPareceristas: React.FC<SelectPareceristasProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterPareceristas();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.nome,
        value: item.login,
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
    <Form.Item
      required
      name='pareceristas'
      label='Pareceristas'
      getValueFromEvent={(_, value) => value}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        id={CF_SELECT_PARECERISTA}
        placeholder='Pareceristas'
        {...selectProps}
      />
    </Form.Item>
  );
};
