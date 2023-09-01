import { Form, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_INPUT_CRITERIOS_VALIDACOES_INSCRICAO_OUTROS } from '~/core/constants/ids/input';
import { CF_SELECT_CRITERIOS_VALIDACOES_INSCRICAO } from '~/core/constants/ids/select';
import { OpcaoListagem } from '~/core/enum/opcao-listagem';
import { obterCriterioValidacaoInscricao } from '~/core/services/proposta-service';
import {
  validarOnChangeMultiSelectOutros,
  validarOnChangeMultiSelectUnico,
} from '~/core/utils/functions';

const SelectCriteriosValidacaoInscricoes: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterCriterioValidacaoInscricao();
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
        unico: item.unico,
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
        const criteriosValidacaoInscricao: number[] = form.getFieldValue(
          'criteriosValidacaoInscricao',
        );

        let campoOutros = null;

        if (criteriosValidacaoInscricao?.length) {
          const ehOutros = criteriosValidacaoInscricao.find(
            (value) => value === OpcaoListagem.Outros,
          );

          if (ehOutros) {
            campoOutros = (
              <Form.Item
                label='Outros'
                name='criterioValidacaoInscricaoOutros'
                rules={[{ required: true }]}
              >
                <Input
                  type='text'
                  maxLength={200}
                  placeholder='Outros'
                  id={CF_INPUT_CRITERIOS_VALIDACOES_INSCRICAO_OUTROS}
                />
              </Form.Item>
            );
          }
        }

        return (
          <>
            <Form.Item
              label='Critérios para validação das inscrições'
              name='criteriosValidacaoInscricao'
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                mode='multiple'
                options={options}
                placeholder='Critérios para validação das inscrições'
                id={CF_SELECT_CRITERIOS_VALIDACOES_INSCRICAO}
                onChange={(value) => {
                  let newValues = validarOnChangeMultiSelectOutros(
                    value,
                    criteriosValidacaoInscricao,
                  );

                  const opcoesAtuais = options.filter((option: any) => {
                    return criteriosValidacaoInscricao.includes(option.value);
                  });

                  const opcoesNovas = options.filter((option: any) => {
                    return newValues.includes(option.value);
                  });

                  newValues = validarOnChangeMultiSelectUnico(opcoesNovas, opcoesAtuais);

                  form.setFieldValue('criteriosValidacaoInscricao', newValues);
                  form.setFieldValue('criterioValidacaoInscricaoOutros', '');
                }}
              />
            </Form.Item>

            {campoOutros ? campoOutros : <></>}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectCriteriosValidacaoInscricoes;
