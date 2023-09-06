import { InfoCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { AbstractCheckboxGroupProps } from 'antd/es/checkbox/Group';
import React, { useEffect, useState } from 'react';
import { CF_RADIO_TIPO_INSCRICAO } from '~/core/constants/ids/radio';
import { obterTipoInscricao } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';
import Radio from '../../radio';

const RadioTipoInscricao: React.FC = () => {
  const [options, setOptions] = useState<AbstractCheckboxGroupProps['options']>([]);

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
    <Radio
      formItemProps={{
        name: 'tipoInscricao',
        label: 'Tipo de inscrição',
        tooltip: {
          title:
            ' Optativa: O cursista irá se inscrever por meio da plataforma. Automática: A área promotora irá informar quais são os cursista e a inscrição será automática.',
          icon: (
            <Tooltip>
              <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
            </Tooltip>
          ),
        },
      }}
      radioGroupProps={{
        id: CF_RADIO_TIPO_INSCRICAO,
        options,
      }}
    />
  );
};

export default RadioTipoInscricao;
