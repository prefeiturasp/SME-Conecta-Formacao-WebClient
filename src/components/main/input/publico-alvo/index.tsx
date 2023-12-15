import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PUBLICO_ALVO } from '~/core/constants/ids/select';
import { PUBLICO_ALVO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { obterPublicoAlvoPublico } from '~/core/services/area-publica-service';
import { obterPublicoAlvo } from '~/core/services/cargo-funcao-service';
import { getTooltipFormInfoCircleFilled } from '../../tooltip';

type SelectPublicoAlvoProps = {
  required?: boolean;
  exibirTooltip?: boolean;
  areaPublica?: boolean;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectPublicoAlvo: React.FC<SelectPublicoAlvoProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
  areaPublica = false,
  formItemProps = {},
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = areaPublica ? await obterPublicoAlvoPublico() : await obterPublicoAlvo();
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
      label='Público alvo'
      name='publicosAlvo'
      {...formItemProps}
      rules={[{ required: required, message: PUBLICO_ALVO_NAO_INFORMADO }]}
      tooltip={{
        title: 'Indicar somente aqueles que têm relação com o tema e objetivos da formação.',
        icon: iconTooltip,
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Público alvo'
        {...selectProps}
        id={CF_SELECT_PUBLICO_ALVO}
      />
    </Form.Item>
  );
};

export default SelectPublicoAlvo;
