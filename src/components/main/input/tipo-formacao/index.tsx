import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { CF_RADIO_TIPO_FORMACAO } from '~/core/constants/ids/radio';
import { obterTipoFormacao } from '~/core/services/proposta-service';
import Radio from '../../radio';

const RadioTipoFormacao: React.FC = () => {
  const [options, setOptions] = useState<AbstractCheckboxGroupProps['options']>([]);

  const obterDados = async () => {
    const resposta = await obterTipoFormacao();
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
    <Radio
      formItemProps={{
        name: 'tipoFormacao',
        label: 'Tipo de formação',
      }}
      radioGroupProps={{
        id: CF_RADIO_TIPO_FORMACAO,
        options
      }}
    />
  );
};

export default RadioTipoFormacao;
