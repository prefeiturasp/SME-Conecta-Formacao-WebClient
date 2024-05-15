import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_SITUACAO } from '~/core/constants/ids/select';
import { SITUACAO_USUARIO_REDE_PARCERIA_NAO_INFORMADO } from '~/core/constants/mensagens';

type SelectSituacaoRedeParceriaUsuarioProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectSituacaoRedeParceriaUsuario: React.FC<
  SelectSituacaoRedeParceriaUsuarioProps
> = ({ selectProps, formItemProps }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    // const resposta = await obterSituacoes();
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
    <Form.Item
      name='situacao'
      label='Situação'
      rules={[
        {
          required: formItemProps?.required ?? false,
          message: SITUACAO_USUARIO_REDE_PARCERIA_NAO_INFORMADO,
        },
      ]}
      {...formItemProps}
    >
      <Select options={options} placeholder='Situação' id={CF_SELECT_SITUACAO} {...selectProps} />
    </Form.Item>
  );
};
