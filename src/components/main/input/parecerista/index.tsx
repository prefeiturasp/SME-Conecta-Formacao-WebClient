import { Form, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PARECERISTA } from '~/core/constants/ids/select';
import { PARECERISTA_NAO_INFORMADO } from '~/core/constants/mensagens';
import { confirmacao } from '~/core/services/alerta-service';
import { obterPareceristas } from '~/core/services/funcionario-service';

type SelectPareceristasProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

type OnDeSelectProps = {
  value?: string[];
  prevValue?: string[];
  onDeselected?: boolean;
};

export const SelectPareceristas: React.FC<SelectPareceristasProps> = ({
  selectProps,
  formItemProps,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [values, setValues] = useState<OnDeSelectProps>();

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
        if (values) {
          form.setFieldValue('pareceristas', values.prevValue);
        }
      },
    });
  };

  useEffect(() => {
    if (values && values.onDeselected) onDeselect();
  }, [values]);

  return (
    <Form.Item
      name='pareceristas'
      label='Pareceristas'
      getValueFromEvent={(_, value) => value}
      rules={[{ required: true, message: PARECERISTA_NAO_INFORMADO }]}
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
        onDeselect={() => setValues({ onDeselected: true })}
        {...selectProps}
      />
    </Form.Item>
  );
};
