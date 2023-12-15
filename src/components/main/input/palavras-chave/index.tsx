import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';

import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PALAVRA_CHAVE } from '~/core/constants/ids/select';
import { PALAVRA_CHAVE_NAO_INFORMADA } from '~/core/constants/mensagens';
import { obterPalavraChavePublico } from '~/core/services/area-publica-service';
import { obterPalavrasChave } from '~/core/services/palavra-chave-service';
import { Colors } from '~/core/styles/colors';

type SelectPalavrasChavesProps = {
  required?: boolean | true;
  exibirTooltip?: boolean | true;
  areaPublica?: boolean;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

const SelectPalavrasChaves: React.FC<SelectPalavrasChavesProps> = ({
  required = true,
  exibirTooltip = true,
  selectProps,
  areaPublica = false,
  formItemProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const form = Form.useFormInstance();
  const obterDados = async () => {
    const resposta = areaPublica ? await obterPalavraChavePublico() : await obterPalavrasChave();
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

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <Form.Item
      label='Palavras-chave'
      name='palavrasChaves'
      rules={[
        { required: required, message: PALAVRA_CHAVE_NAO_INFORMADA },
        {
          validator: (_, value) => {
            if (value && !areaPublica) {
              if (value.length > 5) {
                return Promise.reject(
                  'Escolha no máximo 5 palavras-chave que definam os conceitos e campos do saber desta formação (considerar os conteúdos da formação)',
                );
              } else if (value.length >= 1 && value.length < 3) {
                return Promise.reject(
                  'Escolha no mínimo 3 palavras-chave que definam os conceitos e campos do saber desta formação (considerar os conteúdos da formação)',
                );
              } else if (value.length == 0) {
                form.setFields([
                  {
                    name: 'palavrasChaves',
                    errors: [],
                  },
                ]);
              }
            }
            return Promise.resolve();
          },
        },
      ]}
      tooltip={{
        title:
          'Escolher entre 3 e 5 palavras-chave que definam os conceitos e campos do saber desta formação (considerar os conteúdos da formação)',
        icon: iconTooltip,
      }}
      {...formItemProps}
    >
      <Select
        allowClear
        mode='multiple'
        options={options}
        placeholder={
          areaPublica
            ? 'Palavras-chave'
            : 'Escolha no mínimo 3 palavras-chave e no máximo 5 palavras-chave'
        }
        {...selectProps}
        id={CF_SELECT_PALAVRA_CHAVE}
      />
    </Form.Item>
  );
};

export default SelectPalavrasChaves;
