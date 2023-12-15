import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';
import { MODALIDADE_NAO_INFORMADA } from '~/core/constants/mensagens';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { obterFormatoPublico } from '~/core/services/area-publica-service';
import { obterModalidades } from '~/core/services/modalidade-service';
import { Colors } from '~/core/styles/colors';

type SelectModalidadesProps = {
  required?: boolean;
  areaPublica?: boolean;
  exibirTooltip?: boolean;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectModalidades: React.FC<SelectModalidadesProps> = ({
  selectProps,
  required = true,
  exibirTooltip = true,
  areaPublica = false,
  formItemProps,
}) => {
  const form = Form.useFormInstance();
  const tipoFormacao = Form.useWatch('tipoFormacao', form);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async (tipoFormacao: TipoFormacao) => {
    tipoFormacao = tipoFormacao ?? TipoFormacao.Evento;

    if (tipoFormacao) {
      const resposta = areaPublica ? await obterFormatoPublico() : await obterModalidades();
      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));

        const modalidade = form.getFieldValue('modalidade');
        if (!newOptions.some((t) => t.value === modalidade)) {
          form.setFieldValue('modalidade', null);
        }

        setOptions(newOptions);
        return;
      }
    }
  };

  useEffect(() => {
    obterDados(tipoFormacao);
  }, []);

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Modalidade'
      name='modalidade'
      rules={[{ required: required, message: MODALIDADE_NAO_INFORMADA }]}
      tooltip={{
        title:
          'Para propostas de formações a distância é obrigatório conter o mínimo de 20% e máximo de 40% em atividades presenciais ou aulas síncronas.',
        icon: iconTooltip,
      }}
      {...formItemProps}
    >
      <Select
        placeholder='Modalidade'
        allowClear
        options={options}
        id={CF_SELECT_MODALIDADE}
        {...selectProps}
      />
    </Form.Item>
  );
};

export default SelectModalidades;
