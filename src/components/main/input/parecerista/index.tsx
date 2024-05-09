import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PARECERISTA } from '~/core/constants/ids/select';
import { confirmacao } from '~/core/services/alerta-service';
import { obterPareceristas } from '~/core/services/funcionario-service';

type SelectPareceristasProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectPareceristas: React.FC<SelectPareceristasProps> = ({
  selectProps,
  formItemProps,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [values, setValues] = useState({
    value: [],
    prevValue: [],
  });

  const obterDados = async () => {
    const resposta = await obterPareceristas();

    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        ...item,
        label: item.nome,
        value: item.login,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  const onDeselect = () => {
    confirmacao({
      content: 'Deseja realmente excluir este Parecerista desta proposta?',
      onCancel() {
        form.setFieldValue('pareceristas', values.prevValue);
      },
    });
  };

  useEffect(() => {
    if (!!values.value.length) onDeselect();
  }, [values]);

  return (
    <Form.Item
      required
      name='pareceristas'
      label='Pareceristas'
      getValueFromEvent={(_, value) => value}
      normalize={(value, prevValue) => {
        setValues({ value, prevValue });
        return value;
      }}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        id={CF_SELECT_PARECERISTA}
        placeholder='Pareceristas'
        {...selectProps}
      />
    </Form.Item>
  );
};
