import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_AREA_PROMOTORA } from '~/core/constants/ids/select';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';
import { obterAreaPromotoraPublico } from '~/core/services/area-publica-service';

type SelectAreaPromotoraProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  areaPublica?: boolean;
};

const SelectAreaPromotora: React.FC<SelectAreaPromotoraProps> = ({
  selectProps,
  formItemProps,
  areaPublica,
}) => {
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [disabledSelect, setDisabledSelect] = useState(false);
  const obterDados = async () => {
    const resposta = areaPublica
      ? await obterAreaPromotoraPublico()
      : await obterAreaPromotoraLista();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
      if (newOptions.length == 1) {
        form.setFieldValue('areaPromotoraId', newOptions[0].value);
        setTimeout(() => {
          form.setFieldValue('areaPromotoraId', newOptions[0].value);
        }, 1000);
        setDisabledSelect(true);
      }
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <>
      <Form.Item {...formItemProps} label='Área promotora' rules={[{ required: false }]}>
        <Select
          {...selectProps}
          options={options}
          placeholder='Área promotora'
          id={CF_SELECT_AREA_PROMOTORA}
          disabled={disabledSelect}
        />
      </Form.Item>
    </>
  );
};

export default SelectAreaPromotora;
