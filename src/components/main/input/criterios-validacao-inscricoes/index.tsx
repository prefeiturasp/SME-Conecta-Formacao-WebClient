import { Form, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_INPUT_CRITERIOS_VALIDACOES_INSCRICAO_OUTROS } from '~/core/constants/ids/input';
import { CF_SELECT_CRITERIOS_VALIDACOES_INSCRICAO } from '~/core/constants/ids/select';
import { PROPOSTA_CRITERIO_VALIDACAO_INSCRICAO_OUTROS } from '~/core/constants/mensagens';
import { CampoConsideracaoEnum } from '~/core/enum/campos-proposta-enum';
import { obterCriterioValidacaoInscricao } from '~/core/services/proposta-service';
import { validarOnChangeMultiSelectUnico } from '~/core/utils/functions';
import { ButtonParecer } from '~/pages/cadastros/propostas/form/components/modal-parecer/modal-parecer-button';

const SelectCriteriosValidacaoInscricoes: React.FC = () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterCriterioValidacaoInscricao(true);
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({
        label: item.nome,
        value: item.id,
        unico: item.unico,
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
        const criteriosValidacaoInscricao: number[] = form.getFieldValue(
          'criteriosValidacaoInscricao',
        );

        let campoOutros = null;
        if (criteriosValidacaoInscricao?.length) {
          const ehOutros = options.some(
            (option: any) => criteriosValidacaoInscricao.includes(option.value) && option.outros,
          );

          if (ehOutros) {
            campoOutros = (
              <ButtonParecer campo={CampoConsideracaoEnum.criteriosValidacaoInscricaoOutros}>
                <Form.Item
                  label='Outros'
                  name='criterioValidacaoInscricaoOutros'
                  rules={[
                    { required: true, message: PROPOSTA_CRITERIO_VALIDACAO_INSCRICAO_OUTROS },
                  ]}
                >
                  <Input
                    type='text'
                    maxLength={200}
                    placeholder='Outros'
                    id={CF_INPUT_CRITERIOS_VALIDACOES_INSCRICAO_OUTROS}
                  />
                </Form.Item>
              </ButtonParecer>
            );
          }
        }

        return (
          <>
            <ButtonParecer campo={CampoConsideracaoEnum.criteriosValidacaoInscricao}>
              <Form.Item
                label='Critérios para validação das inscrições'
                name='criteriosValidacaoInscricao'
                rules={[{ required: true, message: PROPOSTA_CRITERIO_VALIDACAO_INSCRICAO_OUTROS }]}
              >
                <Select
                  allowClear
                  mode='multiple'
                  options={options}
                  placeholder='Critérios para validação das inscrições'
                  id={CF_SELECT_CRITERIOS_VALIDACOES_INSCRICAO}
                  onChange={(value) => {
                    const opcoesAtuais = options.filter((option: any) => {
                      return criteriosValidacaoInscricao.includes(option.value);
                    });

                    const opcoesNovas = options.filter((option: any) => {
                      return value.includes(option.value);
                    });

                    const values = validarOnChangeMultiSelectUnico(opcoesNovas, opcoesAtuais);

                    form.setFieldValue('criteriosValidacaoInscricao', values);
                    form.setFieldValue('criterioValidacaoInscricaoOutros', '');
                  }}
                />
              </Form.Item>
            </ButtonParecer>

            {campoOutros ? campoOutros : <></>}
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectCriteriosValidacaoInscricoes;
