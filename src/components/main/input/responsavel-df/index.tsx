import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_RESPONSAVEL_DF } from '~/core/constants/ids/select';
import { RESPONSAVEL_DF_NAO_INFORMADO } from '~/core/constants/mensagens';
import { obterUsuariosAdminDf } from '~/core/services/funcionario-service';
import { Colors } from '~/core/styles/colors';

type SelectResponsavelDfProps = {
  required?: boolean;
  podeEditar?: boolean;
  exibirTooltip?: boolean;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectResponsavelDf: React.FC<SelectResponsavelDfProps> = ({
  required = true,
  podeEditar = true,
  exibirTooltip = true,
  selectProps,
  formItemProps,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterUsuariosAdminDf();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.nome, value: item.rf }));

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

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Responsável DF'
      name='rfResponsavelDf'
      {...formItemProps}
      rules={[{ required: required, message: RESPONSAVEL_DF_NAO_INFORMADO }]}
      tooltip={{
        title: 'Indicar o responsável DF.',
        icon: iconTooltip,
      }}
    >
      <Select
        allowClear
        options={ options }
        placeholder='Responsável DF'
        {...selectProps}
        id={ CF_SELECT_RESPONSAVEL_DF }
        disabled={ !podeEditar }
      />
    </Form.Item>
  );
};

export default SelectResponsavelDf;
