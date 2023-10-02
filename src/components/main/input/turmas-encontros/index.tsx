import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_CRONOGRAMA } from '~/core/constants/ids/select';
import { obterTurmasDaProposta } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectTurmaEncontrosProps = {
  required?: boolean | true;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
  idProposta: any;
};

const SelectTurmaEncontros: React.FC<SelectTurmaEncontrosProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
  idProposta,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterTurmasDaProposta(idProposta);
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
      label='Turma'
      name='turmas'
      rules={[{ required: required, message: 'Selecione uma Turma' }]}
      tooltip={{
        title: 'Você deve informar a Quantidade de turmas, na sessão de Informações gerais',
        icon: iconTooltip,
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Selecione um Turma'
        {...selectProps}
        id={CF_SELECT_TURMA_CRONOGRAMA}
      />
    </Form.Item>
  );
};

export default SelectTurmaEncontros;
