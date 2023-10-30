import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormInstance, Input, Tooltip } from 'antd';
import { FC } from 'react';
import { Colors } from '~/core/styles/colors';

type InputTimerProp = {
  nome: string;
  label: string;
  textoToolTip?: string;
  requerido?: boolean;
  exibirTooltip?: boolean;
  form: FormInstance;
  somenteLeitura?: boolean;
  funcao: (value: string, valorNome: string) => void;
};
const InputTimer: FC<InputTimerProp> = ({
  nome,
  label,
  textoToolTip,
  requerido = true,
  exibirTooltip = true,
  somenteLeitura = false,
  funcao,
}) => {
  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <Form.Item
      label={label}
      name={nome}
      key={nome}
      style={{ marginLeft: '10px' }}
      rules={[
        { required: requerido, message: 'Campo obrigatório' },
        {
          validator: (rule, value, callback) => {
            if (value) {
              if (value.length < 5) {
                rule;
                callback('Informe uma hora no formato 999:99');
              }
            } else {
              callback();
            }
            return;
          },
        },
      ]}
      tooltip={{
        title: textoToolTip,
        icon: iconTooltip,
      }}
    >
      <Input
        readOnly={somenteLeitura}
        maxLength={6}
        onChange={(d) => {
          funcao(d.target.value, nome);
        }}
      />
    </Form.Item>
  );
};

export default InputTimer;
