import { Form, FormItemProps, Input, InputProps } from 'antd';
import React, { useEffect, useState } from 'react';

type InputEmailProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputEmail: React.FC<InputEmailProps> = ({ inputProps, formItemProps }) => {
  const form = Form.useFormInstance();

  const [exibirErro, setExibirErro] = useState(true);

  const removerEspacoEmail = () => {
    const email = form.getFieldValue('email');
    const emailSemEspaco = email.trim();
    form.setFieldValue('email', emailSemEspaco);
    setExibirErro(false);
    form.setFields([
      {
        name: 'email',
        errors: [],
      },
    ]);
    if (!emailSemEspaco.includes('@')) {
      setExibirErro(true);
    }
  };

  useEffect(() => {
    setExibirErro(!!formItemProps?.required);
  }, [formItemProps?.required]);
  return (
    <Form.Item
      label='E-mail'
      name='email'
      rules={[
        { required: !!formItemProps?.required },
        { type: 'email', message: exibirErro ? 'Não é um e-mail válido' : '' },
      ]}
      {...formItemProps}
    >
      <Input
        placeholder='Informe o e-mail'
        autoComplete='off'
        onChange={(_) => {
          removerEspacoEmail();
        }}
        maxLength={100}
        id='INPUT_EMAIL'
        {...inputProps}
      />
    </Form.Item>
  );
};

export default InputEmail;
