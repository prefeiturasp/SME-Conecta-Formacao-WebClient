import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Form, Input, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_INPUT_FUNCAO_ESPECIFICA_OUTROS } from '~/core/constants/ids/input';
import { CF_SELECT_FUNCAO_ESPECIFICA } from '~/core/constants/ids/select';
import { obterFuncaoEspecifica } from '~/core/services/cargo-funcao-service';
import { Colors } from '~/core/styles/colors';
import { validarOnChangeMultiSelectOutros } from '~/core/utils/functions';

const SelectFuncaoEspecifica: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterFuncaoEspecifica();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
        outros: item.outros,
      }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const funcoesEspecificas: number[] = form.getFieldValue('funcoesEspecificas');

        let campoOutros = null;

        if (funcoesEspecificas?.length) {
          const ehOutros = options.some(
            (option: any) => funcoesEspecificas.includes(option.value) && option.outros,
          );

          if (ehOutros) {
            campoOutros = (
              <Form.Item label='Outros' name='funcaoEspecificaOutros' rules={[{ required: true }]}>
                <Input
                  type='text'
                  maxLength={100}
                  placeholder='Outros'
                  id={CF_INPUT_FUNCAO_ESPECIFICA_OUTROS}
                />
              </Form.Item>
            );
          }
        }

        return (
          <>
            <Col span={24}>
              <Form.Item
                label='Função específica'
                name='funcoesEspecificas'
                tooltip={{
                  title:
                    'O curso/evento é SOMENTE para o servidor que esteja exercendo alguma função específica? Em caso afirmativo, identifique a função (Ex: Prof. de Matemática; Diretor de CEI; Prof. Regente no Ciclo de Alfabetização; POED, outros).',
                  icon: (
                    <Tooltip>
                      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
                    </Tooltip>
                  ),
                }}
              >
                <Select
                  allowClear
                  mode='multiple'
                  options={options}
                  placeholder='Função específica'
                  id={CF_SELECT_FUNCAO_ESPECIFICA}
                  onChange={(value) => {
                    const values = validarOnChangeMultiSelectOutros(value, funcoesEspecificas);
                    form.setFieldValue('funcoesEspecificas', values);
                    form.setFieldValue('funcaoEspecificaOutros', '');
                  }}
                />
              </Form.Item>
            </Col>
            {campoOutros ? <Col span={24}>{campoOutros}</Col> : <></>}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectFuncaoEspecifica;
