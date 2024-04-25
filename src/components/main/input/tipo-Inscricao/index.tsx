import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TIPO_INSCRICAO } from '~/core/constants/ids/select';
import {
  TIPO_INSCRICAO_NAO_INFORMADA,
  TIPO_INSCRICAO_TOOLTIP_AUTOMATICA,
  TIPO_INSCRICAO_TOOLTIP_EXTERNA,
  TIPO_INSCRICAO_TOOLTIP_MANUAL,
  TIPO_INSCRICAO_TOOLTIP_OPTATIVA,
} from '~/core/constants/mensagens';
import { TipoInscricao } from '~/core/enum/tipo-inscricao';
import { obterTipoInscricao } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type SelectTipoInscricaoProps = {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  exibirLink: (exibir: boolean) => void;
};
const SelectTipoInscricao: React.FC<SelectTipoInscricaoProps> = ({
  formItemProps,
  selectProps,
  exibirLink,
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const tiposInscricaoTooltips = [
    TIPO_INSCRICAO_TOOLTIP_OPTATIVA,
    TIPO_INSCRICAO_TOOLTIP_MANUAL,
    TIPO_INSCRICAO_TOOLTIP_AUTOMATICA,
    TIPO_INSCRICAO_TOOLTIP_EXTERNA,
  ];

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
    <Form.Item shouldUpdate style={{ margin: 0 }}>
      {(form) => {
        const tiposInscricao: number[] = form.getFieldValue('tiposInscricao');
        const temAutomatica = tiposInscricao?.includes(TipoInscricao.Automatica);
        const temAutomaticaJEIF = tiposInscricao?.includes(TipoInscricao.AutomaticaJEIF);

        const desabilitarOptions = (option: DefaultOptionType) => {
          const tipos = form.getFieldValue('tiposInscricao');
          const existeExterna = tipos?.includes(TipoInscricao.Externa);
          exibirLink(existeExterna);
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
              tooltip={{
                title: tiposInscricaoTooltips.map((tooltip, index) => <p key={index}>{tooltip}</p>),
                icon: <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />,
              }}
              normalize={(value: number[]) => {
                if (value.includes(TipoInscricao.Externa)) {
                  return [TipoInscricao.Externa];
                }

                return value;
              }}
              {...formItemProps}
            >
              <Select
                options={options.map((option) => ({
                  ...option,
                  disabled:
                    desabilitarOptions(option) ||
                    (tiposInscricao?.includes(TipoInscricao.Externa) &&
                      option.value !== TipoInscricao.Externa),
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
