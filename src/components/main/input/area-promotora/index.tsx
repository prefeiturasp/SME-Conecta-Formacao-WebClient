import { Form } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_AREA_PROMOTORA } from '~/core/constants/ids/select';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';
import { obterAreaPromotoraPublico } from '~/core/services/area-publica-service';

type SelectAreaPromotoraProps = {
  selectProps?: SelectProps;
  areaPublica?: boolean;
};

const SelectAreaPromotora: React.FC<SelectAreaPromotoraProps> = ({ selectProps, areaPublica }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = areaPublica
      ? await obterAreaPromotoraPublico()
      : await obterAreaPromotoraLista();
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
    <>
      <Form.Item label='Área promotora' name='areaPromotora' rules={[{ required: false }]}>
        <Select
          {...selectProps}
          options={options}
          placeholder='Área promotora'
          id={CF_SELECT_AREA_PROMOTORA}
        />
      </Form.Item>
    </>
  );
};

export default SelectAreaPromotora;
