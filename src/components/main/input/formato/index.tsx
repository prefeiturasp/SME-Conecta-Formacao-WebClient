import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormInstance, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_FORMATO } from '~/core/constants/ids/select';
import { FORMATO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { obterFormato } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectFormatoProps = {
  form: FormInstance;
  formItemProps?: FormItemProps;
  required?: boolean | true;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
};

const SelectFormato: React.FC<SelectFormatoProps> = ({
  form,
  formItemProps,
  selectProps,
  required = true,
  exibirTooltip = true,
}) => {
  const tipoFormacao = Form.useWatch('tipoFormacao', form);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async (tipoFormacao: TipoFormacao) => {
    tipoFormacao = tipoFormacao ?? TipoFormacao.Evento;

    if (tipoFormacao) {
      const resposta = await obterFormato(tipoFormacao);
      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));

        const formato = form.getFieldValue('formato');
        if (!newOptions.some((t) => t.value === formato)) {
          form.setFieldValue('formato', null);
        }

        setOptions(newOptions);
        return;
      }
    }
  };

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  useEffect(() => {
    obterDados(tipoFormacao);
  }, [tipoFormacao]);

  return (
    <Form.Item
      label='Formato'
      name='formato'
      rules={[{ required: required, message: FORMATO_NAO_INFORMADO }]}
      tooltip={{
        title:
          'Para propostas de formações a distância é obrigatório conter o mínimo de 20% e máximo de 40% em atividades presenciais ou aulas síncronas.',
        icon: iconTooltip,
      }}
      {...formItemProps}
    >
      <Select {...selectProps} options={options} placeholder='Formato' id={CF_SELECT_FORMATO} />
    </Form.Item>
  );
};

export default SelectFormato;
