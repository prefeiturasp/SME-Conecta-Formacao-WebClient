import { Form, FormItemProps, Input, InputProps } from 'antd';
import { Rule } from 'antd/es/form';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { FC, useEffect, useState } from 'react';
import { Formato } from '~/core/enum/formato';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

type InputTimerProp = {
  mensagemErro?: string;
  formItemProps?: FormItemProps;
  inputProps?: InputProps;
  campo?: string;
};
const InputTimer: FC<InputTimerProp> = ({ mensagemErro, formItemProps, inputProps, campo }) => {
  const formInstance = useFormInstance();
  const assicronaWatch = useWatch('cargaHorariaSincrona');
  const distanciaWatch = useWatch('cargaHorariaDistancia');
  const assincrona = formInstance.getFieldValue('cargaHorariaSincrona');
  const distancia = formInstance.getFieldValue('cargaHorariaDistancia');
  const modalidade: Formato = formInstance.getFieldValue('formato');
  const [required, setRequired] = useState<boolean>(false);

  const modalidadeDistancia = modalidade === Formato.Distancia;
  const modalidadePresencial = modalidade === Formato.Presencial;

  const rules: Rule[] = [
    { required, message: mensagemErro || 'Campo obrigatório' },
    { len: 6, message: 'Informe uma hora no formato 999:99' },
  ];

  if (formItemProps?.rules) {
    rules.push(...formItemProps.rules);
  }

  const campoObrigatorioModoDistancia = () => {
    if (modalidadePresencial) {
      switch (campo) {
        case 'cargaHorariaPresencial':
          setRequired(true);
          break;

        default:
          setRequired(false);
          break;
      }
    }

    if (modalidadeDistancia) {
      const campoAssincronaTemValor = !!assicronaWatch?.length || !!assincrona?.length;
      const campoDistanciaTemValor = !!distanciaWatch?.length || !!distancia?.length;

      switch (campo) {
        case 'cargaHorariaSincrona':
          if (!campoDistanciaTemValor) {
            setRequired(true);
          } else {
            setRequired(false);
          }
          break;

        case 'cargaHorariaDistancia':
          if (!campoAssincronaTemValor) {
            setRequired(true);
          } else {
            setRequired(false);
          }
          break;

        default:
          setRequired(false);
          break;
      }
    }
  };

  useEffect(() => {
    campoObrigatorioModoDistancia();
  }, [formInstance, distancia, assincrona]);

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
