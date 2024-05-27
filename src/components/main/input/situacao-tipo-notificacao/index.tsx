import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TIPO_NOTIFICACAO } from '~/core/constants/ids/select';
import notificacaoService from '~/core/services/notificacao-service';

type SelectTipoNotificacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectTipoNotificacao: React.FC<SelectTipoNotificacaoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await notificacaoService.obterNotificacaoTipo();
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
    <Form.Item label='Tipo' name='tipo' {...formItemProps}>
      <Select
        {...selectProps}
        options={options}
        placeholder='Tipo'
        id={CF_SELECT_TIPO_NOTIFICACAO}
      />
    </Form.Item>
  );
};
