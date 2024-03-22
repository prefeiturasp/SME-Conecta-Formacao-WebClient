import { Form, FormItemProps, Input, InputProps } from 'antd';
import React, { useState } from 'react';
import { CF_INPUT_EMAIL_EDUCACIONAL } from '~/core/constants/ids/input';

type InputEmailEducacionalProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputEmailEducacional: React.FC<InputEmailEducacionalProps> = ({
  inputProps,
  formItemProps,
}) => {
  const form = Form.useFormInstance();
  const [exibirErro, setExibirErro] = useState(true);
  const validarEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const reEspacos = /\s/;
    const reAcentos = /[áàãâéèêíïóôõöúçñÁÀÃÂÉÈÊÍÏÓÔÕÖÚÇÑ]/;

    return !reEspacos.test(email) && !reAcentos.test(email) && re.test(email);
  };
  const removerEspacoEmail = () => {
    const emailEdu = form.getFieldValue('emailEducacional');

    const emailEduSemEspaco = emailEdu != null && emailEdu != undefined ? emailEdu?.trim() : null;

    form.setFieldValue('emailEducacional', emailEduSemEspaco);
    setExibirErro(false);
    form.setFields([
      {
        name: 'emailEducacional',
        errors: [],
      },
    ]);
    const emailValido = validarEmail(emailEduSemEspaco);

    if(!emailValido){
      setExibirErro(true);
    }
  };
  return (
    <Form.Item
      label='E-mail @edu'
      name='emailEducacional'
      rules={[
        { required: !!formItemProps?.required },
        { type: 'email', message: exibirErro ? 'Não é um e-mail válido' : '' },
      ]}
      {...formItemProps}
    >
      <Input
        placeholder='Informe o e-mail @edu'
        autoComplete='off'
        onChange={(_) => {
          console.log('emailUnico');
          removerEspacoEmail();
        }}
        maxLength={100}
        id={CF_INPUT_EMAIL_EDUCACIONAL}
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputEmailEducacional;
