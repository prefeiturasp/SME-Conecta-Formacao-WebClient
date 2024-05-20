import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
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
  const rules: Rule[] = [
    { required, message: mensagemErro || 'Campo obrigatório' },
    { len: 6, message: 'Informe uma hora no formato 999:99' },
  ];

  if (formItemProps?.rules) {
    rules.push(...formItemProps.rules);
  }

  return (
    <Form.Item
      getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) =>
        formatarDuasCasasDecimais(e.target.value)
      }
      rules={rules}
      {...formItemProps}
    >
      <Input maxLength={6} {...inputProps} />
    </Form.Item>
  );
};

export default InputTimer;
