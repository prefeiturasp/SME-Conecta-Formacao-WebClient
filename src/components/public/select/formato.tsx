import { Form } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_FORMATO } from '~/core/constants/ids/select';
import { FORMATO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { obterFormatoPublico } from '~/core/services/area-publica-service';

type SelectFormatoPublicoProps = {
  required?: boolean | true;
  selectProps?: SelectProps;
};

const SelectFormatoPublico: React.FC<SelectFormatoPublicoProps> = ({
  required = false,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async () => {
    const resposta = await obterFormatoPublico();
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
    <Form.Item
      label='Formato'
      name='formato'
      rules={[{ required: required, message: FORMATO_NAO_INFORMADO }]}
    >
      <Select
        allowClear
        options={options}
        placeholder='Formato'
        {...selectProps}
        id={CF_SELECT_FORMATO}
      />
    </Form.Item>
  );
};

export default SelectFormatoPublico;
