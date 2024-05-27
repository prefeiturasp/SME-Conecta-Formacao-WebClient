import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_SITUACAO_NOTIFICACAO } from '~/core/constants/ids/select';
import notificacaoService from '~/core/services/notificacao-service';

type SelectSituacaoNotificacaoProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectSituacaoNotificacao: React.FC<SelectSituacaoNotificacaoProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await notificacaoService.obterNotificacaoSituacao();
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
    <Form.Item label='Situação' name='situacao' {...formItemProps}>
      <Select
        {...selectProps}
        options={options}
        placeholder='Situação'
        id={CF_SELECT_SITUACAO_NOTIFICACAO}
      />
    </Form.Item>
  );
};
