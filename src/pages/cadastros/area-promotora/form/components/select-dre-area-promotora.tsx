import { Col, Form, FormInstance, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
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
  const form = Form.useFormInstance();

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const perfilWatch = Form.useWatch('perfil', form);
  const perfil = formSelect?.getFieldValue('perfil');

  const perfilDRE = 3;

  const ehPerfilDRE = perfilWatch?.visaoId === perfilDRE || perfil?.visaoId === perfilDRE;

  const obterDRE = async () => {
    const resposta = await obterDREs();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    }
  };

  useEffect(() => {
    if (ehPerfilDRE) {
      obterDRE();
    }
  }, [ehPerfilDRE]);

  if (!ehPerfilDRE) return <></>;

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
};
