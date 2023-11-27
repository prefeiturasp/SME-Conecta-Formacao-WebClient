import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PUBLICO_ALVO } from '~/core/constants/ids/select';
import { PUBLICO_ALVO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { obterPublicoAlvo } from '~/core/services/cargo-funcao-service';
import { Colors } from '~/core/styles/colors';

type SelectPublicoAlvoProps = {
  required?: boolean | true;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
};

const SelectPublicoAlvo: React.FC<SelectPublicoAlvoProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterPublicoAlvo();
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

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Público alvo'
      name='publicosAlvo'
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
