import { Col, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';

type SelectAnoEtapaProps = {
  mostrarOpcaoTodas?: boolean;
};

const SelectAnoEtapa: React.FC<SelectAnoEtapaProps> = ({ mostrarOpcaoTodas = true }) => {
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const dados = [
    {
      codigoEOL: 'a',
      descricao: 'a',
    },
  ];

  const obterDados = useCallback(async () => {
    // const resposta = await obterAnoEtapa();

    if (dados.length) {
      const newOptions = dados.map((item) => ({
        ...item,
        value: item?.codigoEOL,
        label: item?.descricao,
      }));

      // if (resposta.sucesso) {

      //   const newOptions = resposta.dados.map((item) => ({
      //     ...item,
      //     value: item?.codigoEOL,
      //     label: item?.descricao,
      //   }));

      //TODO: AGUARDAR ENDPOINT FICAR PRONTO
      if (dados.length === 1) {
        const fieldValue = dados[0];
        form.setFieldValue('anoEtapa', fieldValue);
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_DRE = {
          value: '-99',
          label: 'Todos',
          codigoEOL: 'a',
          descricao: 'a',
        };
        newOptions.unshift(OPCAO_TODAS_DRE);
      }

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
