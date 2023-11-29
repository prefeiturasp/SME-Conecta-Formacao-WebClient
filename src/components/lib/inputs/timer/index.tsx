import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Input, Tooltip } from 'antd';
import { WrapperTooltipProps } from 'antd/es/form/FormItemLabel';
import { FC } from 'react';
import { Colors } from '~/core/styles/colors';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputTimerProp = {
  nome: string;
  label: string;
  textToolTip?: WrapperTooltipProps['title'];
  required?: boolean;
  mensagemErro?: string;
};
const InputTimer: FC<InputTimerProp> = ({
  nome,
  label,
  textToolTip,
  mensagemErro,
  required = false,
}) => {
  let tooltip: WrapperTooltipProps | undefined = undefined;

  if (textToolTip) {
    tooltip = {
      title: textToolTip,
      icon: (
        <Tooltip>
          <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
        </Tooltip>
      ),
    };
  }

  return (
    <Form.Item
      label={label}
      name={nome}
      key={nome}
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        formatarDuasCasasDecimais(e.target.value)
      }
      rules={[
        { required, message: mensagemErro || 'Campo obrigatório' },
        { len: 6, message: 'Informe uma hora no formato 999:99' },
      ]}
      tooltip={tooltip}
    >
      <Input maxLength={6} />
    </Form.Item>
  );
};

export default InputTimer;
