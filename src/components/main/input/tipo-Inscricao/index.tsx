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
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

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

  const handleSelectChange = (values: number[]) => {
    setSelectedValues(values);
  };

  const filterOptions = () => {
    return options.map((option) => {      
      if (
        (selectedValues.includes(TipoInscricao.Automatica) && option.value === 3) ||
        (selectedValues.includes(TipoInscricao.AutomaticaJEIF) && option.value === 2)
      ) {
        return { ...option, disabled: true };
      }
      return option;
    });
  };

  return (
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
            <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
          </Tooltip>
        ),
      }}
    >
      <Select
        options={filterOptions()}
        placeholder='Tipo de inscrição'
        id={CF_SELECT_TIPO_INSCRICAO}
        {...selectProps}
        onChange={handleSelectChange}
        value={selectedValues}
      />
    </Form.Item>
  );
};

export default SelectTipoInscricao;
