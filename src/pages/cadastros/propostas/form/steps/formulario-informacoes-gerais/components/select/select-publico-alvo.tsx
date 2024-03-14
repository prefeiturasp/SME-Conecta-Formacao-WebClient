import { Col, Form, FormItemProps, Input } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import { CF_INPUT_PUBLICO_ALVO_OUTROS } from '~/core/constants/ids/input';
import { CF_SELECT_PUBLICO_ALVO } from '~/core/constants/ids/select';
import {
  ANO_ETAPA_NAO_INFORMADO,
  COMPONENTE_NAO_INFORMADO,
  MODALIDADE_NAO_INFORMADA,
  PUBLICO_ALVO_NAO_INFORMADO,
} from '~/core/constants/mensagens';
import { obterPublicoAlvo } from '~/core/services/cargo-funcao-service';

type SelectPublicoAlvoProps = {
  formItemProps?: FormItemProps;
  exibirTooltip?: boolean | true;
  selectProps?: SelectProps;
  exibirOpcaoOutros?: boolean;
  existeValoresSelecionados: (value: boolean) => void;
  definiOutrosCamposComoRequerido: (value: boolean) => void;
};

const SelectPublicoAlvoCadastroProposta: React.FC<SelectPublicoAlvoProps> = ({
  selectProps,
  formItemProps,
  exibirOpcaoOutros = false,
  existeValoresSelecionados,
  definiOutrosCamposComoRequerido,
}) => {
  const form = useFormInstance();
  const anosTurmas = Form.useWatch('anosTurmas', form);
  const modalidade = Form.useWatch('modalidade', form);
  const funcoesEspecificas = Form.useWatch('funcoesEspecificas', form);
  const componentesCurriculares = Form.useWatch('componentesCurriculares', form);

  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterPublicoAlvo(exibirOpcaoOutros);
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

  const campoEhObrigatorio = () => {
    if (
      funcoesEspecificas?.length ||
      (anosTurmas?.length && modalidade && componentesCurriculares?.length)
    ) {
      return false;
    }

    return true;
  };

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
      {(form) => {
        const publicosAlvos: number[] = form.getFieldValue('publicosAlvo');

        let campoOutros = null;
        let outrosValor = 0;
        if (publicosAlvos?.length) {
          const ehOutros = options.some(
            (option: any) => publicosAlvos.includes(option.value) && option.outros,
          );

          if (options?.filter((x) => x?.outros)[0]?.value) {
            outrosValor = Number(options?.filter((x) => x?.outros)[0]?.value);
          }

          if (ehOutros) {
            campoOutros = (
              <Form.Item label='Outros' name='publicoAlvoOutros' rules={[{ required: true }]}>
                <Input
                  type='text'
                  maxLength={100}
                  placeholder='Outros'
                  id={CF_INPUT_PUBLICO_ALVO_OUTROS}
                />
              </Form.Item>
            );
          }
        }
        return (
          <>
            <Col span={24}>
              <Form.Item
                label='Público alvo'
                name='publicosAlvo'
                dependencies={[
                  'funcoesEspecificas',
                  'modalidade',
                  'anosTurmas',
                  'componentesCurriculares',
                ]}
                rules={[
                  {
                    required: campoEhObrigatorio(),
                    message: PUBLICO_ALVO_NAO_INFORMADO,
                  },
                ]}
                tooltip={getTooltipFormInfoCircleFilled(
                  'Indicar somente aqueles que têm relação com o tema e objetivos da formação.',
                )}
                {...formItemProps}
              >
                <Select
                  allowClear
                  mode='multiple'
                  options={options}
                  placeholder='Público alvo'
                  onChange={(valor) => {
                    if (valor.length) {
                      existeValoresSelecionados(true);
                      form.setFieldValue('anosTurmas', undefined);
                      form.setFieldValue('componentesCurriculares', undefined);
                      definiOutrosCamposComoRequerido(false);
                      form.setFields([
                        {
                          name: 'componentesCurriculares',
                          errors: [],
                        },
                        {
                          name: 'anosTurmas',
                          errors: [],
                        },
                      ]);
                      const publicosAlvos: number[] = form.getFieldValue('publicosAlvo');
                      const novosValores = publicosAlvos?.filter((v) => v != outrosValor);
                      form.setFieldValue('publicosAlvo', novosValores);

                      if (outrosValor == 0 && valor.length)
                        form.setFieldValue('publicoAlvoOutros', undefined);
                    } else {
                      existeValoresSelecionados(false);
                      definiOutrosCamposComoRequerido(true);
                      const modalidadeValor = form.getFieldValue('modalidade');
                      if (modalidadeValor == undefined) {
                        form.setFields([
                          {
                            name: 'modalidade',
                            errors: [MODALIDADE_NAO_INFORMADA],
                          },
                        ]);
                      }
                      form.setFields([
                        {
                          name: 'componentesCurriculares',
                          errors: [COMPONENTE_NAO_INFORMADO],
                        },
                        {
                          name: 'anosTurmas',
                          errors: [ANO_ETAPA_NAO_INFORMADO],
                        },
                      ]);
                    }
                  }}
                  {...selectProps}
                  id={CF_SELECT_PUBLICO_ALVO}
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

export default SelectPublicoAlvoCadastroProposta;
