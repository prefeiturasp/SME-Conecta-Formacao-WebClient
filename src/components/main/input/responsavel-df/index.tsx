import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_RESPONSAVEL_DF } from '~/core/constants/ids/select';
import { obterUsuariosAdminDf } from '~/core/services/funcionario-service';

type SelectResponsavelDfProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectResponsavelDf: React.FC<SelectResponsavelDfProps> = ({
  selectProps,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterUsuariosAdminDf();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.rf }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item label='Responsável DF'
      name='responsavel-df'
      rules={[{ required: true }]} {...formItemProps}>
      <Select {...selectProps} options={options} placeholder='Responsável DF' id={CF_SELECT_RESPONSAVEL_DF} />
    </Form.Item>
  );
};

export default SelectResponsavelDf;
