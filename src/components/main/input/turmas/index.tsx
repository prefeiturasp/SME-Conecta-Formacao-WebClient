import { Form } from 'antd';
import { FormItemInputProps } from 'antd/es/form/FormItemInput';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_CRONOGRAMA } from '~/core/constants/ids/select';

type SelectTurmaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemInputProps;
  serviceAPI?: any;
};

const SelectTurma: React.FC<SelectTurmaProps> = ({ selectProps, formItemProps, serviceAPI }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await serviceAPI();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item: any) => ({
        label: item.descricao,
        value: item.id,
      }));
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
      rules={[{ message: 'Selecione uma Turma' }]}
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

export default SelectTurma;
