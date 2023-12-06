import { Form, FormInstance, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_MODALIDADE } from '~/core/constants/ids/select';
import { TipoFormacao } from '~/core/enum/tipo-formacao';

type SelectModalidadesProps = {
  form: FormInstance;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectModalidades: React.FC<SelectModalidadesProps> = ({
  form,
  selectProps,
  formItemProps,
}) => {
  const tipoFormacao = Form.useWatch('tipoFormacao', form);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const dados = [
    {
      codigoEOL: 'a',
      descricao: 'a',
    },
  ];

  const obterDados = async (tipoFormacao: TipoFormacao) => {
    tipoFormacao = tipoFormacao ?? TipoFormacao.Evento;

    // if (tipoFormacao) {
    //   const resposta = await obterModalidades(tipoFormacao);
    //   if (resposta.sucesso) {
    //     const newOptions = resposta.dados.map((item) => ({
    //       label: item.descricao,
    //       value: item.id,
    //     }));

    //     const modalidade = form.getFieldValue('modalidade');
    //     if (!newOptions.some((t) => t.value === modalidade)) {
    //       form.setFieldValue('modalidade', null);
    //     }

    //     setOptions(newOptions);
    //     return;
    //   }
    // }

    if (dados.length) {
      const newOptions = dados.map((item) => ({
        ...item,
        value: item?.codigoEOL,
        label: item?.descricao,
      }));

      setOptions(newOptions);
    }
  };

  useEffect(() => {
    obterDados(tipoFormacao);
  }, [tipoFormacao]);

  return (
    <Form.Item label='Modalidade' name='modalidade' {...formItemProps}>
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Modalidade'
        id={CF_SELECT_MODALIDADE}
        {...selectProps}
      />
    </Form.Item>
  );
};

export default SelectModalidades;
