import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_VAGAS_REMANESCENTES } from '~/core/constants/ids/select';
import { obterCargosFuncoes } from '~/core/services/cargo-funcao-service';
import { Colors } from '~/core/styles/colors';

const SelectVagasRemanescentes: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterCargosFuncoes();
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
      label='Em caso de vagas remanescentes'
      name='vagasRemanecentes'
      tooltip={{
        title:
          'Havendo vagas remanescentes, poderão ser contemplados os seguintes cargos e/ou funções como público-alvo.',
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
        placeholder='Em caso de vagas remanescentes'
        id={CF_SELECT_VAGAS_REMANESCENTES}
      />
    </Form.Item>
  );
};

export default SelectVagasRemanescentes;
