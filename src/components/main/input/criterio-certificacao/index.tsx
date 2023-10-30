import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CRITERIO_CERTIFICACAO } from '~/core/constants/ids/select';
import { obterCriterioCertificacao } from '~/core/services/criterio-certificacao-service';
import { Colors } from '~/core/styles/colors';

type SelectCriterioCertificacaoProps = {
  onchange: VoidFunction;
};

const SelectCriterioCertificacao: React.FC<SelectCriterioCertificacaoProps> = ({ onchange }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async () => {
    const resposta = await obterCriterioCertificacao();
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
    <Form.Item shouldUpdate>
      {(form) => {
        const requerido: boolean = form.getFieldValue('cursoComCertificado');
        const criterios: number[] = form.getFieldValue('criterioCertificacao');
        const error = form.getFieldError('criterioCertificacao');
        if (!requerido && error.length > 0) {
          form.setFields([
            {
              name: 'criterioCertificacao',
              errors: [],
            },
          ]);
        }
        return (
          <>
            <Form.Item
              label='Critérios para certificação'
              name='criterioCertificacao'
              rules={[{ required: requerido }]}
              style={{ paddingBottom: '0px', marginBottom: '0px' }}
              tooltip={{
                title: 'Indique ao menos 3 critérios.',
                icon: requerido ? (
                  <Tooltip>
                    <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
                  </Tooltip>
                ) : (
                  <></>
                ),
              }}
            >
              <Select
                allowClear
                mode='multiple'
                options={options}
                onChange={onchange}
                placeholder='Critérios para certificação'
                id={CF_SELECT_CRITERIO_CERTIFICACAO}
              />
            </Form.Item>
            {criterios?.length < 3 && requerido ? (
              <span style={{ color: '#b40c02' }}>Indique ao menos 3 critérios.</span>
            ) : (
              ''
            )}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectCriterioCertificacao;
