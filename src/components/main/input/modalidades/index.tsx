import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormInstance, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { obterModalidades } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectModalidadesProps = {
  form: FormInstance;
  required?: boolean | true;
};

const SelectModalidades: React.FC<SelectModalidadesProps> = ({ form, required = true }) => {
  const tipoFormacao = Form.useWatch('tipoFormacao', form);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async (tipoFormacao: TipoFormacao) => {
    if (tipoFormacao) {
      const resposta = await obterModalidades(tipoFormacao);
      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));
        setOptions(newOptions);
        return;
      }
    }

    setOptions([]);
  };

  useEffect(() => {
    obterDados(tipoFormacao);
  }, [tipoFormacao]);

  return (
    <Form.Item
      label='Modalidade'
      name='modalidade'
      rules={[{ required: required }]}
      tooltip={{
        title:
          'Para propostas de formações a distância é obrigatório conter o mínimo de 20% e máximo de 40% em atividades presenciais ou aulas síncronas.',
        icon: (
          <Tooltip>
            <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
          </Tooltip>
        ),
      }}
    >
      <Select options={options} placeholder='Modalidade' id={CF_SELECT_MODALIDADE} />
    </Form.Item>
  );
};

export default SelectModalidades;
