import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_CRITERIO_CERTIFICACAO } from '~/core/constants/ids/select';
import { CRITERIOS_PARA_CERTIFICACAO_NAO_INFORMADO } from '~/core/constants/mensagens';
import { obterCriterioCertificacao } from '~/core/services/criterio-certificacao-service';
import { Colors } from '~/core/styles/colors';

type SelectCriterioCertificacaoProps = {
  onchange: VoidFunction;
};

const SelectCriterioCertificacao: React.FC<SelectCriterioCertificacaoProps> = ({ onchange }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const mensagemErroQuantidadeCriterios =
    'É necessário informar ao menos 3 critérios para certificação.';
  const [mensagemErro, setMensagemErro] = useState(mensagemErroQuantidadeCriterios);
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
          console.log('!requerido && error.length > 0');
          form.setFields([
            {
              name: 'criterioCertificacao',
              errors: [],
            },
          ]);
        } else if (requerido && error.length == 0 && criterios?.length > 3) {
          setMensagemErro('');
        } else if (requerido && criterios?.length < 3 && error.length == 0) {
          setMensagemErro(mensagemErroQuantidadeCriterios);
        }
        return (
          <>
            <Form.Item
              label='Critérios para certificação'
              name='criterioCertificacao'
              rules={[{ required: requerido, message: CRITERIOS_PARA_CERTIFICACAO_NAO_INFORMADO }]}
              style={{ paddingBottom: '0px', marginBottom: '0px' }}
              tooltip={{
                title: 'Indique ao menos 3 critérios.',
                icon: requerido ? (
                  <Tooltip>
                    <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
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
            {requerido && criterios?.length < 3 && error.length == 0 ? (
              <span style={{ color: Colors.Suporte.Primary.ERROR }}>{mensagemErro}</span>
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
