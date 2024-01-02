import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_FUNCAO_ATIVIDADE } from '~/core/constants/ids/select';
import { obterDadosInscricao } from '~/core/services/inscricao-service';

type SelectFuncaoAtividadeProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectFuncaoAtividade: React.FC<SelectFuncaoAtividadeProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[] | undefined>([]);

  const obterDados = async () => {
    const resposta = await obterDadosInscricao();

    if (resposta.sucesso) {
      const item = resposta.dados.usuarioCargos.find((item: any) => item);

      if (item) {
        const newOptions = item?.funcoes?.map((item: any) => ({
          label: item.descricao,
          value: item.codigo,
        }));

        setOptions(newOptions);
      } else {
        setOptions([]);
      }
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Função/Atividade' name='funcoes' {...formItemProps}>
      <Select
        allowClear
        options={options}
        placeholder='Selecione uma Função/Atividade'
        {...selectProps}
        id={CF_SELECT_FUNCAO_ATIVIDADE}
      />
    </Form.Item>
  );
};

export default SelectFuncaoAtividade;
