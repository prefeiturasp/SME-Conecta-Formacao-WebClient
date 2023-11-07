import { Col, Form, FormInstance, Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { CF_SELECT_DRE } from '~/core/constants/ids/select';
import { obterDREs } from '~/core/services/dre-service';

interface SelectDREAreaPromotoraProps {
  formSelect?: FormInstance;
  selectProps?: SelectProps;
}

export const SelectDREAreaPromotora: React.FC<SelectDREAreaPromotoraProps> = ({
  formSelect,
  selectProps,
}) => {
  const perfilDRE = 3;
  const form = Form.useFormInstance();

  const ehPerfilDRE = Form.useWatch('grupoId', form)?.visaoId === perfilDRE;
  const temPerfilAoEditar = formSelect?.getFieldValue('dreId');

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDRE = async () => {
    const resposta = await obterDREs();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    }
  };

  useEffect(() => {
    obterDRE();
  }, []);

  if (temPerfilAoEditar || ehPerfilDRE) {
    return (
      <Col xs={24} sm={12}>
        <Form.Item label='DRE' key='dreId' name='dreId' rules={[{ required: true }]}>
          <Select
            allowClear
            {...selectProps}
            options={options}
            id={CF_SELECT_DRE}
            placeholder='Selecione a DRE'
          />
        </Form.Item>
      </Col>
    );
  }

  if (!ehPerfilDRE) return <></>;
};
