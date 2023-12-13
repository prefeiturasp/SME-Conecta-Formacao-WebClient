import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';
import { obterAnoEtapa } from '~/core/services/ano-etapa-service';
import { onchangeMultiSelectOpcaoTodos } from '~/core/utils/functions';

type SelectAnoEtapaProps = {
  exibirOpcaoTodos?: boolean;
};

const SelectAnoEtapa: React.FC<SelectAnoEtapaProps> = ({ exibirOpcaoTodos = true }) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const modalidadesWatch = Form.useWatch('modalidades', form);
  const modalidades = form.getFieldValue('modalidades');

  const valorModalidadesValido =
    typeof modalidadesWatch === 'number' ||
    (Array.isArray(modalidadesWatch) && modalidadesWatch.length > 0);

  const obterValorModalidadeValido =
    typeof modalidades === 'number' || (Array.isArray(modalidades) && modalidades.length > 0);

  const obterDados = useCallback(async () => {
    const anoLetivoAtual = dayjs().year();
    if (valorModalidadesValido || obterValorModalidadeValido) {
      const resposta = await obterAnoEtapa(anoLetivoAtual, modalidadesWatch, exibirOpcaoTodos);

      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          ...item,
          label: item.descricao,
          value: item.id,
        }));
        setOptions(newOptions);
      } else {
        setOptions([]);
      }
    }
  }, [valorModalidadesValido, obterValorModalidadeValido, modalidadesWatch, exibirOpcaoTodos]);

  useEffect(() => {
    obterDados();
  }, [modalidadesWatch, obterDados]);

  useEffect(() => {
    if (form.isFieldTouched('modalidades')) {
      form.setFieldValue('anosTurmas', []);
      setOptions([]);
    }
  }, [form, modalidadesWatch]);

  return (
    <Form.Item
      label='Ano/Etapa'
      name='anosTurmas'
      normalize={(value: number[], prevValue: number[]) => {
        if (exibirOpcaoTodos) {
          const opcaoTodos = options.find((item) => !!item.todos);

          const valorTodosComparacao = opcaoTodos?.value;

          const newValue = onchangeMultiSelectOpcaoTodos(value, prevValue, valorTodosComparacao);

          return newValue;
        }

        return value;
      }}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder='Ano/Etapa'
        id={CF_SELECT_ANO_ETAPA}
      />
    </Form.Item>
  );
};

export default SelectAnoEtapa;
