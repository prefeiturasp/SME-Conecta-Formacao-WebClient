import { Col, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_COMPONENTE_CURRICULAR } from '~/core/constants/ids/select';

type SelectComponenteCurricularProps = {
  mostrarOpcaoTodas?: boolean;
};

const SelectComponenteCurricular: React.FC<SelectComponenteCurricularProps> = ({
  mostrarOpcaoTodas = true,
}) => {
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const dados = [
    {
      codigoEOL: 'a',
      descricao: 'a',
    },
  ];

  const obterDados = useCallback(async () => {
    // const resposta = await obterComponenteCurricular();

    if (dados.length) {
      const newOptions = dados.map((item) => ({
        ...item,
        value: item?.codigoEOL,
        label: item?.descricao,
      }));
      // if (resposta.sucesso) {
      //   const newOptions = resposta.dados.map((item) => ({
      //     label: item.nome,
      //     value: item.codigoEOL,
      //   }));

      //TODO: AGUARDAR ENDPOINT FICAR PRONTO
      if (dados.length === 1) {
        const fieldValue = dados[0];
        form.setFieldValue('anoEtapa', fieldValue);
      } else if (mostrarOpcaoTodas) {
        const OPCAO_TODAS_DRE = { value: '-99', label: 'Todos', codigoEOL: 'a', descricao: 'a' };
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
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      <Col span={24}>
        <Form.Item label='Componente Curricular' name='componenteCurricular'>
          <Select
            allowClear
            mode='multiple'
            options={options}
            placeholder='Componente Curricular'
            id={CF_SELECT_COMPONENTE_CURRICULAR}
          />
        </Form.Item>
      </Col>
    </Form.Item>
  );
};

export default SelectComponenteCurricular;
