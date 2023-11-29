import { InfoCircleFilled } from '@ant-design/icons';
import Tooltip from 'antd/es/tooltip';
import React from 'react';
import { CF_RADIO_FORMACAO_HOMOLOGADA } from '~/core/constants/ids/radio';
import { Colors } from '~/core/styles/colors';
import Radio from '../../radio';
import { FORMACAO_HOMOLOGADA_NAO_INFORMADA } from '~/core/constants/mensagens';

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
  const options = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

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
              <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
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
