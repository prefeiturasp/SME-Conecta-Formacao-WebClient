import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { Colors } from '~/core/styles/colors';
import { CF_SELECT_TIPO_ENCONTRO } from '../../../../core/constants/ids/select/index';
import { obterTipoEncontro } from '~/core/services/proposta-service';

type SelectTipoEncontroProps = {
  required?: boolean | true;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
};

const SelectTipoEncontro: React.FC<SelectTipoEncontroProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterTipoEncontro();
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

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Tipo de Encontro'
      name='tipoEncontro'
      rules={[{ required: required }]}
      tooltip={{
        title: 'Você deve informar um tipo de encontro',
        icon: iconTooltip,
      }}
    >
      <Select
        allowClear
        options={options}
        placeholder='Selecione um Tipo de Encontro'
        {...selectProps}
        id={CF_SELECT_TIPO_ENCONTRO}
      />
    </Form.Item>
  );
};

export default SelectTipoEncontro;
