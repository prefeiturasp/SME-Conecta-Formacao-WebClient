import { Col, Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_COMPONENTE_CURRICULAR } from '~/core/constants/ids/select';
import { obterComponenteCurricular } from '~/core/services/componentes-curriculares-service';

type SelectComponenteCurricularProps = {
  exibirOpcaoTodos?: boolean;
};

const SelectComponenteCurricular: React.FC<SelectComponenteCurricularProps> = ({
  exibirOpcaoTodos = true,
}) => {
  const form = useFormInstance();
  const anoTurmaId = Form.useWatch('anosTurmas', form);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterComponenteCurricular(anoTurmaId, exibirOpcaoTodos);

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (anoTurmaId?.length) obterDados();
  }, [anoTurmaId]);

  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Col span={24}>
        <Form.Item label='Componente Curricular' name='componentesCurriculares'>
          <Select
            allowClear
            mode='multiple'
            options={options}
            placeholder='Componente Curricular'
            id={CF_SELECT_COMPONENTE_CURRICULAR}
            // labelInValue
            // onChange={(event) => {
            //   event.find((ehTodos) => {
            //     ehTodos.label === 'Todos' && form.setFieldValue('componentesCurriculares', ehTodos);
            //   });
            // }}
          />
        </Form.Item>
      </Col>
    </Form.Item>
  );
};

export default SelectComponenteCurricular;
