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
    const emailRegexEdu = /^[a-zA-Z0-9._%+-]+@edu\.sme\.prefeitura\.sp\.gov\.br$/;
    const emailEdu = form.getFieldValue('emailEducacional');
    const emailUnico = form.getFieldValue('email');
    const emails = form.getFieldValue('emails');
    const emailsSemEspaco = emails
      ? emails.map((e: { [x: string]: string }) => {
          return { email: e['email'].trim() };
        })
      : [];
    const emailUnicoSemEspaco =
      (emailUnico != null && emailUnico != undefined) || emailsSemEspaco.length == 0
        ? emailUnico?.trim()
        : null;

    const emailsParaAdicionar = emailsSemEspaco.length ? emailsSemEspaco : emailUnicoSemEspaco;
    if (emailUnicoSemEspaco) form.setFieldValue('email', emailsParaAdicionar);
    if (emailsSemEspaco.length) form.setFieldValue('emails', emailsParaAdicionar);
    console.log(emailUnicoSemEspaco);
    if (!emailUnicoSemEspaco.length) form.resetFields(['emailEducacional']);
    setExibirErro(false);
    form.setFields([
      {
        name: 'email',
        errors: [],
      },
      {
        name: 'emails',
        errors: [],
      },
    ]);
    if(emailRegexEdu.test(emailsParaAdicionar)){
      if(!emailRegexEdu.test(emailEdu)){
        form.setFieldValue('emailEducacional', emailsParaAdicionar.split('@')[0]);
      }
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
        { message: exibirErro ? 'Não é um e-mail válido' : '' },
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
