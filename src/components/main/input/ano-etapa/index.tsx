import { Col, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';
import { obterAnoEtapa } from '~/core/services/proposta-service';

type SelectAnoEtapaProps = {
  mostrarOpcaoTodas?: boolean;
};

const SelectAnoEtapa: React.FC<SelectAnoEtapaProps> = ({ mostrarOpcaoTodas = true }) => {
  // const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = useCallback(async () => {
    const resposta = await obterAnoEtapa();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        value: item?.codigoEOL,
        label: item?.descricao,
      }));

      //TODO: AGUARDAR ENDPOINT FICAR PRONTO
      // if (newOptions?.length === 1) {
      //   const fieldValue = newOptions[0];
      //   form.setFieldValue(descricao, fieldValue);
      // } else if (mostrarOpcaoTodas) {
      //   const OPCAO_TODAS_DRE = { value: OpcaoListagem.Todos, label: 'Todas' };
      //   newOptions.unshift(OPCAO_TODAS_DRE);
      // }

      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  }, [mostrarOpcaoTodas]);

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Col span={24}>
        <Form.Item label='Ano/Etapa' name='anoEtapa'>
          <Select
            allowClear
            mode='multiple'
            options={options}
            placeholder='Ano/Etapa'
            id={CF_SELECT_ANO_ETAPA}
          />
        </Form.Item>
      </Col>
    </Form.Item>
  );
};

export default SelectAnoEtapa;
