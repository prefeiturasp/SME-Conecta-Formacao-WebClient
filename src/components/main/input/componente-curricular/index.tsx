import { Col, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_COMPONENTE_CURRICULAR } from '~/core/constants/ids/select';
import { obterComponenteCurricular } from '~/core/services/proposta-service';

type SelectComponenteCurricularProps = {
  mostrarOpcaoTodas?: boolean;
};

const SelectComponenteCurricular: React.FC<SelectComponenteCurricularProps> = ({
  mostrarOpcaoTodas = true,
}) => {
  // const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = useCallback(async () => {
    const resposta = await obterComponenteCurricular();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.codigoEOL,
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
