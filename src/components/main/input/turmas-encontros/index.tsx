import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_CRONOGRAMA } from '~/core/constants/ids/select';
import { obterTurmasDaProposta } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectTurmaEncontrosProps = {
  required?: boolean;
  exibirTooltip?: boolean;
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  idProposta: any;
  selectMultiplo?: boolean;
};

const SelectTurmaEncontros: React.FC<SelectTurmaEncontrosProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
  idProposta,
  formItemProps,
  selectMultiplo = true,
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
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : (
    <></>
  );
  const modeSelect = selectMultiplo ? 'multiple' : undefined;
  return (
    <Form.Item
      label='Turma'
      name='turmas'
      rules={[{ required: required, message: 'Selecione uma Turma' }]}
      tooltip={{
        title: 'Você deve informar a Quantidade de turmas, na sessão de Informações gerais',
        icon: iconTooltip,
      }}
      {...formItemProps}
    >
      <Select
        allowClear
        mode={modeSelect}
        options={options}
        placeholder='Selecione uma Turma'
        {...selectProps}
        id={CF_SELECT_TURMA_CRONOGRAMA}
      />
    </Form.Item>
  );
};

export default SelectTurmaEncontros;
