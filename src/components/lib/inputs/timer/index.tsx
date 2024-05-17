import { Form, FormItemProps, Input, InputProps } from 'antd';
import { FC } from 'react';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputTimerProp = {
  required?: boolean;
  mensagemErro?: string;
  formItemProps?: FormItemProps;
  inputProps?: InputProps;
};
const InputTimer: FC<InputTimerProp> = ({
  mensagemErro,
  required = false,
  formItemProps,
  inputProps,
}) => {
  return (
    <Form.Item
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        formatarDuasCasasDecimais(e.target.value)
      }
      rules={[
        { required, message: mensagemErro || 'Campo obrigatório' },
        { len: 6, message: 'Informe uma hora no formato 999:99' },
      ]}
      {...formItemProps}
    >
      <Input maxLength={6} {...inputProps} />
    </Form.Item>
  );
};

export default InputTimer;
