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
  disabled?: boolean;
};
const InputTimer: FC<InputTimerProp> = ({
  nome,
  label,
  textToolTip,
  required = false,
  disabled = false,
}) => {
  let tooltip: WrapperTooltipProps | undefined = undefined;

  if (textToolTip) {
    tooltip = {
      title: textToolTip,
      icon: (
        <Tooltip>
          <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
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
        { required, message: 'Campo obrigatório' },
        { len: 6, message: 'Informe uma hora no formato 999:99' },
      ]}
      tooltip={tooltip}
    >
      <Input disabled={disabled} maxLength={6} />
    </Form.Item>
  );
};

export default InputTimer;
