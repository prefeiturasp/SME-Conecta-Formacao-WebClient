import { Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_AREA_PROMOTORA } from '~/core/constants/ids/select';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';

const SelectAreaPromotora: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterAreaPromotoraLista();
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
    <Form.Item label='Área promotora' name='areaPromotora' rules={[{ required: false }]}>
      <Select options={options} placeholder='Área promotora' id={CF_SELECT_AREA_PROMOTORA} />
    </Form.Item>
  );
};

export default SelectAreaPromotora;
