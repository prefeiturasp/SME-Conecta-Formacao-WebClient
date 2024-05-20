import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import { FC, useContext } from 'react';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';
import { PropostaCargaHorariaTotalContext } from '~/pages/cadastros/propostas/form/steps/formulario-detalhamento/provider';

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
  const { cargasHorariaCorrespondem } = useContext(PropostaCargaHorariaTotalContext);

  const rules: Rule[] = [
    { required, message: mensagemErro || 'Campo obrigatório' },
    { len: 6, message: 'Informe uma hora no formato 999:99' },
  ];
  rules.push({
    validator() {
      if (cargasHorariaCorrespondem) {
        return Promise.reject(
          'A soma dos campos de carga horária deve ser igual a carga horária total.',
        );
      }

      return Promise.resolve();
    },
  });

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
