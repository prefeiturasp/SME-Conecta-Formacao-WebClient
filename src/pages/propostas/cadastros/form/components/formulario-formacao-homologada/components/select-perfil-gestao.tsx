import { Col, Form, FormInstance, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_GRUPO_GESTAO } from '~/core/constants/ids/select';
import { obterGruposPerfis } from '~/core/services/grupo-service';

interface SelectPerfilGestaoProps {
  selectProps?: SelectProps;
}

export const SelectPerfilGestao: React.FC<SelectPerfilGestaoProps> = ({ selectProps }) => {
  const form = Form.useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const formacaoHomologada = Form.useWatch('formacaoHomologada', form);

  const obterDados = async (formacaoHomologada: boolean) => {
    if (formacaoHomologada == null || !formacaoHomologada) {
      const resposta = await obterGruposPerfis();
      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.nome,
          value: item.id,
        }));

        setOptions(newOptions);
        return;
      }
    }
  };

  useEffect(() => {
    obterDados(formacaoHomologada);
  }, [formacaoHomologada]);

  if (formacaoHomologada == null || formacaoHomologada) return <></>;

  return (
    <Col xs={24} sm={12}>
      <Form.Item
        label='Responsável pela validação'
        key='grupoGestaoId'
        name='grupoGestaoId'
        rules={[{ required: true }]}
      >
        <Select
          allowClear
          {...selectProps}
          options={options}
          id={CF_SELECT_GRUPO_GESTAO}
          placeholder='Selecione a gestão responsável'
        />
      </Form.Item>
    </Col>
  );
};
