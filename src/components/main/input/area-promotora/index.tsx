import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_AREA_PROMOTORA } from '~/core/constants/ids/select';
import { AREA_PROMOTORA_NAO_INFORMADA } from '~/core/constants/mensagens';
import {
  obterAreaPromotoraLista,
  obterUsuarioRedeParceria,
} from '~/core/services/area-promotora-service';
import { obterAreaPromotoraPublico } from '~/core/services/area-publica-service';

type SelectAreaPromotoraProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  areaPublica?: boolean;
  usuarioRedeParceria?: boolean;
};

const SelectAreaPromotora: React.FC<SelectAreaPromotoraProps> = ({
  selectProps,
  formItemProps,
  areaPublica,
  usuarioRedeParceria,
}) => {
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [disabledSelect, setDisabledSelect] = useState(false);

  let resposta;

  const obterDados = async () => {
    switch (true) {
      case areaPublica:
        resposta = await obterAreaPromotoraPublico();
        break;

      case usuarioRedeParceria:
        resposta = await obterUsuarioRedeParceria();
        break;

      default:
        resposta = await obterAreaPromotoraLista();
        break;
    }

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
      if (newOptions.length == 1) {
        form.setFieldValue('areaPromotoraId', newOptions[0].value);
        setDisabledSelect(true);
      }
    } else {
      setOptions([]);
    }
  };
  useEffect(() => {
    obterDados();
  }, [disabledSelect]);

  return (
    <Form.Item
      name='areaPromotoraId'
      label='Área promotora'
      rules={[
        { required: !!formItemProps?.required || false, message: AREA_PROMOTORA_NAO_INFORMADA },
      ]}
      {...formItemProps}
    >
      <Select
        options={options}
        placeholder='Área promotora'
        id={CF_SELECT_AREA_PROMOTORA}
        disabled={disabledSelect}
        {...selectProps}
      />
    </Form.Item>
  );
};

export default SelectAreaPromotora;
