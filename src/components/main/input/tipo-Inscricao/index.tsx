import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TIPO_INSCRICAO } from '~/core/constants/ids/select';
import { TIPO_INSCRICAO_NAO_INFORMADA } from '~/core/constants/mensagens';
import { TipoInscricao } from '~/core/enum/tipo-inscricao';
import { obterTipoInscricao } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectTipoInscricaoProps = {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
};
const SelectTipoInscricao: React.FC<SelectTipoInscricaoProps> = ({
  formItemProps,
  selectProps,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const obterDados = async () => {
    const resposta = await obterTipoInscricao();
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
        const tiposInscricao: number[] = form.getFieldValue('tiposInscricao');
        const temAutomatica = tiposInscricao?.includes(TipoInscricao.Automatica);
        const temAutomaticaJEIF = tiposInscricao?.includes(TipoInscricao.AutomaticaJEIF);

        const desabilitarOptions = (option: DefaultOptionType) => {
          if (
            (temAutomatica && option.value === TipoInscricao.AutomaticaJEIF) ||
            (temAutomaticaJEIF && option.value === TipoInscricao.Automatica)
          ) {
            return true;
          }
          return false;
        };

        return (
          <>
            <Form.Item
              label='Tipo de inscrição'
              name='tiposInscricao'
              rules={[{ required: true, message: TIPO_INSCRICAO_NAO_INFORMADA }]}
              {...formItemProps}
              tooltip={{
                title:
                  'Optativa: O cursista irá se inscrever por meio da plataforma. Automática: A área promotora irá informar quais são os cursista e a inscrição será automática.',
                icon: (
                  <Tooltip>
                    <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
                  </Tooltip>
                ),
              }}
            >
              <Select
                options={options.map((option) => ({
                  ...option,
                  disabled: desabilitarOptions(option),
                }))}
                placeholder='Tipo de inscrição'
                id={CF_SELECT_TIPO_INSCRICAO}
                {...selectProps}
              />
            </Form.Item>
          </>
        );
      }}
    </Form.Item>
  );
};

export default SelectTipoInscricao;
