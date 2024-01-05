import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_NOME_FORMACAO } from '~/core/constants/ids/select';

type SelectNomeFormacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectNomeFormacao: React.FC<SelectNomeFormacaoProps> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    // const resposta = await obterNomeFormacao();
    // if (resposta.sucesso) {
    //   const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
    //   setOptions(newOptions);
    // } else {
    //   setOptions([]);
    // }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Nome da Formação' name='nomeFormacao' {...formItemProps}>
      <Select
        allowClear
        options={options}
        placeholder='Nome da Formação'
        id={CF_SELECT_NOME_FORMACAO}
        {...selectProps}
      />
    </Form.Item>
  );
};
export default SelectNomeFormacao;
