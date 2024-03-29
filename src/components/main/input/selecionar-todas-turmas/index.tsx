/* eslint-disable jsx-a11y/no-static-element-interactions */
import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip, TreeSelect } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import { obterTurmasDaProposta } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectTodasTurmasProps = {
  required?: boolean;
  exibirTooltip?: boolean;
  idProposta: any;
  formItemProps?: FormItemProps;
  maxTagCount?: number;
  onChange: () => void;
};

const SelectTodasTurmas: React.FC<SelectTodasTurmasProps> = ({
  required = true,
  exibirTooltip = true,
  idProposta,
  formItemProps,
  maxTagCount = 0,
  onChange,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const form = Form.useFormInstance();
  const obterDados = async () => {
    const resposta = await obterTurmasDaProposta(idProposta);
    if (resposta.sucesso) {
      const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };
  const allIds = options.length > 0 ? options.map<number>(({ value }) => Number(value)) : [];
  useEffect(() => {
    const turmasIds = form.getFieldValue('turmas');
    obterDados();
    if (turmasIds != undefined) setSelectedValues(turmasIds);
  }, []);

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : (
    <></>
  );

  return (
    <Form.Item
      label='Turma'
      name='turmas'
      rules={[{ required: required, message: 'Selecione uma Turma' }]}
      tooltip={{
        title: 'Você deve informar a Quantidade de turmas, na sessão de Informações gerais',
        icon: iconTooltip,
      }}
      {...formItemProps}
    >
      <TreeSelect
        placeholder='Selecione uma Turma'
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        dropdownStyle={{ maxHeight: '300px' }}
        onChange={(ids) => {
          form.setFieldValue('turmas', ids);
          setSelectedValues(ids);
          onChange();
        }}
        value={selectedValues}
        maxTagCount={maxTagCount > 0 ? maxTagCount : 12}
        maxTagPlaceholder={(omittedValues) => `+ ${omittedValues.length} Turmas ...`}
        treeData={[
          {
            title:
              selectedValues.length > 0 ? (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <span
                  onClick={() => {
                    setSelectedValues([]);
                    form.setFieldValue('turmas', undefined);
                    onChange();
                  }}
                  style={{
                    display: 'inline-block',
                    color: '#286FBE',
                    cursor: 'pointer',
                  }}
                >
                  Remover todas
                </span>
              ) : (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <span
                  onClick={() => {
                    setSelectedValues(allIds);
                    form.setFieldValue('turmas', allIds);
                    onChange();
                  }}
                  style={{
                    display: 'inline-block',
                    color: '#286FBE',
                    cursor: 'pointer',
                  }}
                >
                  Selecionar todas
                </span>
              ),
            disableCheckbox: true,
            disabled: false,
          },
          ...options,
        ]}
      />
    </Form.Item>
  );
};

export default SelectTodasTurmas;
