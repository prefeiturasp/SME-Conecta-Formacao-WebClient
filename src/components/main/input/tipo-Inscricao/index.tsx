import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TIPO_INSCRICAO } from '~/core/constants/ids/select';
import { TIPO_INSCRICAO_NAO_INFORMADA } from '~/core/constants/mensagens';
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
    <Form.Item
      label='Tipo de inscrição'
      name='tipoInscricao'
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
        options={options}
        placeholder='Tipo de inscrição'
        id={CF_SELECT_TIPO_INSCRICAO}
        {...selectProps}
      />
    </Form.Item>
  );
};

export default SelectTipoInscricao;
