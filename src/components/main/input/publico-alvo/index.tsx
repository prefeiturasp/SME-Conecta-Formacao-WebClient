import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PUBLICO_ALVO } from '~/core/constants/ids/select';
import { obterPublicoAlvo } from '~/core/services/cargo-funcao-service';
import { Colors } from '~/core/styles/colors';

const SelectPublicoAlvo: React.FC = () => {
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

  return (
    <Form.Item
      label='Público alvo'
      name='publicosAlvo'
      rules={[{ required: true }]}
      tooltip={{
        title: 'Indicar somente aqueles que têm relação com o tema e objetivos da formação.',
        icon: (
          <Tooltip>
            <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
          </Tooltip>
        ),
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Público alvo'
        id={CF_SELECT_PUBLICO_ALVO}
      />
    </Form.Item>
  );
};

export default SelectPublicoAlvo;
