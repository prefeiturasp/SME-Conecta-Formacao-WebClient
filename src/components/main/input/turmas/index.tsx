import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TURMA_INSCRICAO } from '~/core/constants/ids/select';
import { useAppSelector } from '~/core/hooks/use-redux';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';

type SelectTurmaProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectTurma: React.FC<SelectTurmaProps> = ({ selectProps, formItemProps }) => {
  const propostaId = useAppSelector((state) => state.inscricao.id);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = useCallback(async () => {
    if (propostaId) {
      const resposta = await obterTurmasInscricao(propostaId);

      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));
        setOptions(newOptions);
      } else {
        setOptions([]);
      }
    }
  }, [propostaId]);

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item
      label='Turma'
      name='turmas'
      rules={[
        { required: true, message: 'Selecione uma Turma' },
        {
          validator(_, value) {
            if (!value) {
              return Promise.reject('A seleção de no mínimo uma turma é obrigatória.');
            }

            return Promise.resolve();
          },
        },
      ]}
      {...formItemProps}
    >
      <Select
        allowClear
        options={options}
        placeholder='Selecione uma Turma'
        {...selectProps}
        id={CF_SELECT_TURMA_INSCRICAO}
      />
    </Form.Item>
  );
};

export default SelectTurma;
