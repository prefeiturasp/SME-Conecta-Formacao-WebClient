import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CATEGORIA_NOTIFICACAO } from '~/core/constants/ids/select';
import notificacaoService from '~/core/services/notificacao-service';

type SelectCategoriaNotificacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectCategoriaNotificacao: React.FC<SelectCategoriaNotificacaoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await notificacaoService.obterNotificacaoCategoria();
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
    <Form.Item label='Categoria' name='categoria' {...formItemProps}>
      <Select
        {...selectProps}
        options={options}
        placeholder='Categoria'
        id={CF_SELECT_CATEGORIA_NOTIFICACAO}
      />
    </Form.Item>
  );
};
