import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';
import { dayjs } from '~/core/date/dayjs';

import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';
import { obterAnoEtapa } from '~/core/services/ano-etapa-service';
import { onchangeMultiSelectOpcaoTodos } from '~/core/utils/functions';

type SelectAnoEtapaProps = {
  exibirOpcaoTodos?: boolean;
  campoRequerido?: boolean;
  desativarCampo?: boolean;
};

const SelectAnoEtapa: React.FC<SelectAnoEtapaProps> = ({
  campoRequerido = false,
  desativarCampo = false,
  exibirOpcaoTodos = true,
}) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const modalidadeWatch = Form.useWatch('modalidade', form);
  const modalidade = form.getFieldValue('modalidade');

  const valormodalidadeValido =
    typeof modalidadeWatch === 'number' ||
    (Array.isArray(modalidadeWatch) && modalidadeWatch.length > 0);

  const obterValorModalidadeValido =
    typeof modalidade === 'number' || (Array.isArray(modalidade) && modalidade.length > 0);

  const obterDados = useCallback(async () => {
    const anoLetivoAtual = dayjs().year();
    if (valormodalidadeValido || obterValorModalidadeValido) {
      const resposta = await obterAnoEtapa(anoLetivoAtual, modalidadeWatch, exibirOpcaoTodos);

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
  }, [valormodalidadeValido, obterValorModalidadeValido, modalidadeWatch, exibirOpcaoTodos]);

  useEffect(() => {
    obterDados();
  }, [modalidadeWatch, obterDados]);

  useEffect(() => {
    if (form.isFieldTouched('modalidade')) {
      form.setFieldValue('anosTurmas', []);
      setOptions([]);
    }
  }, [form, modalidadeWatch]);

  return (
    <Form.Item
      label='Ano/Etapa'
      name='anosTurmas'
      rules={[{ required: campoRequerido, message: 'É necessário informar Ano/Etapa' }]}
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
        disabled={desativarCampo}
        id={CF_SELECT_ANO_ETAPA}
      />
    </Form.Item>
  );
};

export default SelectAnoEtapa;
