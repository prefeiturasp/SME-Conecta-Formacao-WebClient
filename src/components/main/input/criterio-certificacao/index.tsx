import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CRITERIO_CERTIFICACAO } from '~/core/constants/ids/select';
import { obterCriterioCertificacao } from '~/core/services/criterio-certificacao-service';
import { Colors } from '~/core/styles/colors';

type SelectCriterioCertificacaoProps = {
  required?: boolean;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
  onchange: VoidFunction;
};

const SelectCriterioCertificacao: React.FC<SelectCriterioCertificacaoProps> = ({
  required = false,
  exibirTooltip = true,
  selectProps,
  onchange,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async () => {
    const resposta = await obterCriterioCertificacao();
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

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <Form.Item
      label='Critérios para certificação'
      name='criterioCertificacao'
      rules={[
        { required: required },
        {
          validator: (rule, value, callback) => {
            if (value) {
              rule;
              callback(value.length < 3 && required ? 'Indique ao menos 3 critérios.' : '');
            }
            return;
          },
        },
      ]}
      tooltip={{
        title: 'Indique ao menos 3 critérios.',
        icon: iconTooltip,
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        onChange={onchange}
        placeholder='Critérios para certificação'
        {...selectProps}
        id={CF_SELECT_CRITERIO_CERTIFICACAO}
      />
    </Form.Item>
  );
};

export default SelectCriterioCertificacao;
