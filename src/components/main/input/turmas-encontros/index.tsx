import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_CRONOGRAMA } from '~/core/constants/ids/select';
import { obterTurmasDaProposta } from '~/core/services/proposta-service';
import { getTooltipFormInfoCircleFilled } from '../../tooltip';

type SelectTurmaEncontrosProps = {
  selectProps?: SelectProps;
  idProposta: number;
  formItemProps?: FormItemProps;
};

const SelectTurmaEncontros: React.FC<SelectTurmaEncontrosProps> = ({
  selectProps,
  idProposta,
  formItemProps,
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

  return (
    <Form.Item
      label='Turma'
      name='turmas'
      rules={[{ required: !!formItemProps?.required || true, message: 'Selecione uma Turma' }]}
      tooltip={getTooltipFormInfoCircleFilled(
        'Você deve informar a Quantidade de turmas, na sessão de Informações gerais',
      )}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Selecione uma Turma'
        {...selectProps}
        id={CF_SELECT_TURMA_CRONOGRAMA}
      />
    </Form.Item>
  );
};

export default SelectTurmaEncontros;
