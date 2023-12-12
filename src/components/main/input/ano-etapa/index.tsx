import { Col, Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_ANO_ETAPA } from '~/core/constants/ids/select';
import { obterAnoEtapa } from '~/core/services/ano-etapa-service';

type SelectAnoEtapaProps = {
  exibirOpcaoTodos?: boolean;
};

const SelectAnoEtapa: React.FC<SelectAnoEtapaProps> = ({ exibirOpcaoTodos = true }) => {
  const form = useFormInstance();
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const modalidades = Form.useWatch('modalidades', form);
  const obterValorModalidade = form.getFieldValue('modalidades');

  const valorModalidadesValido =
    typeof modalidades === 'number' || (Array.isArray(modalidades) && modalidades.length > 0);

  const obterValorModalidadeValido =
    typeof obterValorModalidade === 'number' ||
    (Array.isArray(obterValorModalidade) && obterValorModalidade.length > 0);

  const obterDados = async () => {
    const anoLetivoAtual = dayjs().year();

    if (valorModalidadesValido || obterValorModalidadeValido) {
      const resposta = await obterAnoEtapa(
        anoLetivoAtual.toString(),
        anoLetivoAtual,
        modalidades,
        exibirOpcaoTodos,
      );

      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));
        setOptions(newOptions);
      } else {
        setOptions([]);
      }
    }
  };

  useEffect(() => {
    obterDados();
  }, [modalidades]);

  return (
    <Form.Item style={{ marginBottom: 0 }}>
      <Col span={24}>
        <Form.Item label='Ano/Etapa' name='anosTurmas'>
          <Select
            allowClear
            mode='multiple'
            options={options}
            placeholder='Ano/Etapa'
            id={CF_SELECT_ANO_ETAPA}
            // labelInValue
            // onChange={(event) => {
            //   event.find((ehTodos: any) => {
            //     ehTodos.label === 'Todos' && form.setFieldValue('anosTurmas', ehTodos);
            //   });
            // }}
          />
        </Form.Item>
      </Col>
    </Form.Item>
  );
};

export default SelectAnoEtapa;
