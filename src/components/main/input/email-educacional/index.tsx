import { Form, Input } from 'antd';
import React, { useState } from 'react';
import { CF_INPUT_EMAIL_EDUCACIONAL } from '~/core/constants/ids/input';

const InputEmailEducacional: React.FC = () => {
  const form = Form.useFormInstance();
  const [exibirErro, setExibirErro] = useState(true);
  const removerEspacoEmail = () => {
    const emailEdu = form.getFieldValue('emailEducacional');

    const emailEduSemEspaco =
      emailEdu != null && emailEdu != undefined ? emailEdu?.trim().split('@')[0] : null;

    form.setFieldValue('emailEducacional', emailEduSemEspaco);
    setExibirErro(false);
    form.setFields([
      {
        name: 'emailEducacional',
        errors: [],
      },
    ]);
  };
  return (
    <Form.Item
      label='E-mail @edu'
      name='emailEducacional'
      rules={[{ required: true }, { message: exibirErro ? 'Não é um e-mail válido' : '' }]}
    >
      <Input
        placeholder='Digite o e-mail sem o @edu.sme.prefeitura.sp.gov.br'
        autoComplete='off'
        onChange={(_) => {
          removerEspacoEmail();
        }}
        maxLength={100}
        suffix='@edu.sme.prefeitura.sp.gov.br'
        id={CF_INPUT_EMAIL_EDUCACIONAL}
      />
    </Form.Item>
  );
};

export default InputEmailEducacional;
