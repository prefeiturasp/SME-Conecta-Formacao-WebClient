import { Form } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PALAVRA_CHAVE } from '~/core/constants/ids/select';
import { PALAVRA_CHAVE_NAO_INFORMADA } from '~/core/constants/mensagens';
import { obterPalavraChave } from '~/core/services/area-publica-service';

type SelectPalavrasChavesPublicoProps = {
  required?: boolean | true;
  selectProps?: SelectProps;
};

const SelectPalavrasChavesPublico: React.FC<SelectPalavrasChavesPublicoProps> = ({
  required = false,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async () => {
    const resposta = await obterPalavraChave();
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
      label='Palavras-chave'
      name='palavra-chave'
      rules={[{ required: required, message: PALAVRA_CHAVE_NAO_INFORMADA }]}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Palavras-chave'
        {...selectProps}
        id={CF_SELECT_PALAVRA_CHAVE}
      />
    </Form.Item>
  );
};

export default SelectPalavrasChavesPublico;
