import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { CF_RADIO_FORMACAO_HOMOLOGADA } from '~/core/constants/ids/radio';
import Radio from '../../radio';
import { FormacaoHomologada } from '~/core/enum/formacao-homologada';

const RadioFormacaoHomologadaProps = [
  { label: 'Não', value: 0 },
  { label: 'Sim', value: 1 },
];

const RadioFormacaoHomologada: React.FC = () => {
  const [options, setOptions] = useState<AbstractCheckboxGroupProps['options']>([]);

  const obterDados = async () => {
    const resposta = RadioFormacaoHomologadaProps.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    setOptions(resposta);
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Radio
      formItemProps={{
        name: 'formacaoHomologada',
        label: 'Formação homologada',
        rules: [{ required: false }],
      }}
      radioGroupProps={{
        id: CF_RADIO_FORMACAO_HOMOLOGADA,
        options,
        value: FormacaoHomologada.Nao,
        defaultValue: FormacaoHomologada.Nao,
      }}
    />
  );
};

export default RadioFormacaoHomologada;
