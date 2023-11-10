import { Col, Form, FormInstance, Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const form = Form.useFormInstance();

  const temPerfilAoEditar = formSelect?.getFieldValue('dreId');
  const ehPerfilDRE = Form.useWatch('grupoId', form)?.visaoId === perfilDRE;
  const perfil = formSelect?.getFieldValue('grupoId')?.[0]?.visaoId === perfilDRE;

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

  const componente = (
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

  if ((id && ehPerfilDRE) || (id && perfil)) {
    return componente;
  }

  if (id && !ehPerfilDRE) return <></>;

  if (ehPerfilDRE || temPerfilAoEditar) {
    return componente;
  }

  if (!ehPerfilDRE) return <></>;
};
