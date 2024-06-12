import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_RESPONSAVEL_DF } from '~/core/constants/ids/select';
import { obterUsuariosAdminDf } from '~/core/services/funcionario-service';
import { getTooltipFormInfoCircleFilled } from '../../tooltip';

type SelectResponsavelDfProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectResponsavelDf: React.FC<SelectResponsavelDfProps> = ({
  selectProps,
  formItemProps,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterUsuariosAdminDf();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.login }));

      const rfResponsavelDf = form.getFieldValue('rfResponsavelDf');
      if (!newOptions.some((t) => t.value === rfResponsavelDf)) {
        form.setFieldValue('rfResponsavelDf', null);
      }

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
      required
      label='Responsável DF'
      name='rfResponsavelDf'
      tooltip={getTooltipFormInfoCircleFilled('Indicar o responsável DF.')}
      {...formItemProps}
    >
      <Select
        allowClear
        options={options}
        placeholder='Responsável DF'
        {...selectProps}
        id={CF_SELECT_RESPONSAVEL_DF}
      />
    </Form.Item>
  );
};

export default SelectResponsavelDf;
