import { Form, Select } from 'antd';
import React from 'react';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

interface SelectTurmaProps {
  turmasAPI: RetornoListagemDTO[];
  turmaDisabled: boolean;
  name?: string;
  label?: string;
  required?: boolean;
}

const SelectTurma: React.FC<SelectTurmaProps> = ({
  turmasAPI,
  turmaDisabled,
  name = 'turmaId',
  label = 'Turma',
  required = false,
}) => {
  return (
    <Form.Item label={label} name={name} rules={[{ required }]}>
      <Select
        placeholder='Selecione a turma'
        options={turmasAPI.map((turma) => ({
          label: turma.descricao,
          value: turma.id,
        }))}
        disabled={turmaDisabled}
        allowClear
      />
    </Form.Item>
  );
};

export default SelectTurma;
