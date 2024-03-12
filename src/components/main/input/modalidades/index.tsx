import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';
import { obterModalidades } from '~/core/services/modalidade-service';

type SelectModalidadesProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  campoRequerido?: boolean;
  desativarCampo?: boolean;
};

const SelectModalidade: React.FC<SelectModalidadesProps> = ({
  selectProps,
  formItemProps,
  desativarCampo = false,
  campoRequerido = false,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterModalidades();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item
      label='Modalidade'
      name='modalidade'
      rules={[{ required: campoRequerido }]}
      {...formItemProps}
    >
      <Select
        allowClear
        disabled={desativarCampo}
        options={options}
        placeholder='Modalidade'
        id={CF_SELECT_MODALIDADE}
        onChange={() => {
          form.setFieldValue('anosTurmas', []);
          form.setFieldValue('componentesCurriculares', []);
        }}
        {...selectProps}
      />
    </Form.Item>
  );
};
export default SelectModalidade;
