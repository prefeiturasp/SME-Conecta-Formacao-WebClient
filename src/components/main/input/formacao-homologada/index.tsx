import { InfoCircleFilled } from '@ant-design/icons';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import Tooltip from 'antd/es/tooltip';
import React, { useEffect, useState } from 'react';
import { CF_RADIO_FORMACAO_HOMOLOGADA } from '~/core/constants/ids/radio';
import { FORMACAO_HOMOLOGADA_NAO_INFORMADA } from '~/core/constants/mensagens';
import { obterFormacaoHomologada } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';
import Radio from '../../radio';

type RadioFormacaoHomologadaProps = {
  label?: string;
  name?: string;
  required?: boolean;
};

const RadioFormacaoHomologada: React.FC<RadioFormacaoHomologadaProps> = ({
  name,
  label,
  required,
}) => {
  const [options, setOptions] = useState<AbstractCheckboxGroupProps['options']>([]);

  const obterDados = async () => {
    const resposta = await obterFormacaoHomologada();
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
        name: name ?? 'formacaoHomologada',
        label: label ?? 'Formação homologada',
        tooltip: {
          title:
            'Selecione "Sim" para formações que serão validadas pela Divisão de Formação conforme o Edital de habilitação de cursos e eventos formativos e "Não" para as demais formações.',
          icon: (
            <Tooltip>
              <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
            </Tooltip>
          ),
        },
        rules: [{ required: !!required, message: FORMACAO_HOMOLOGADA_NAO_INFORMADA }],
      }}
      radioGroupProps={{
        id: CF_RADIO_FORMACAO_HOMOLOGADA,
        options,
      }}
    />
  );
};
export default RadioFormacaoHomologada;
