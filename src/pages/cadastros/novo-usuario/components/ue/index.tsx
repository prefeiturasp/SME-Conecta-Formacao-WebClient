import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

type SelectUEsProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  ues?: RetornoListagemDTO[];
};

const SelectUEs: React.FC<SelectUEsProps> = ({ selectProps, formItemProps, ues }) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    if (ues) {
      const newOptions = ues.map((item: RetornoListagemDTO) => ({
        label: item.descricao,
        value: item.id,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, [ues]);

  return (
    <Form.Item label='UE(s)' name='ues' {...formItemProps}>
      <Select
        allowClear
        options={options}
        placeholder='UE(s)'
        id={CF_SELECT_MODALIDADE}
        onChange={() => {
          form.setFieldValue('codigoUE', '');
        }}
        {...selectProps}
      />
    </Form.Item>
  );
};
export default SelectUEs;
