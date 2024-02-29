import { Form, Input } from 'antd';
import { FormItemProps, Rule } from 'antd/es/form';
import { PasswordProps } from 'antd/es/input';
import React from 'react';

type SenhaCadastroProps = {
  senhaAtual?: boolean;
  confirmarSenha?: { fieldName: string };
  inputProps: PasswordProps;
  formItemProps?: FormItemProps;
};

const SenhaCadastro: React.FC<SenhaCadastroProps> = ({
  senhaAtual = false,
  confirmarSenha,
  inputProps,
  formItemProps,
}) => {
  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) =>
    `${e?.target?.value}`.trim();

  const rules: Rule[] = [
    { required: true, min: 4, max: 12 },
    {
      pattern: /^(?=.*[a-z]{1})/,
      message: 'Deve conter uma letra minúscula',
    },
    {
      pattern: /(?=.*[A-Z]{1})/,
      message: 'Deve conter uma letra maiúscula',
    },
    {
      pattern: /(?=.*\d|\W)/,
      message: 'Deve conter um algarismo (número) ou um símbolo (caractere especial)',
    },
    {
      pattern: /^[^À-ú]+$/,
      message: 'Não pode conter caracteres acentuados',
    },
  ];

  if (confirmarSenha?.fieldName) {
    rules.push(({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue(confirmarSenha.fieldName) === value) return Promise.resolve();

        return Promise.reject(new Error('Senhas não correspondem'));
      },
    }));
  }

  return (
    <Form.Item
      getValueFromEvent={getValueFromEvent}
      rules={senhaAtual ? [] : rules}
      dependencies={confirmarSenha ? [confirmarSenha.fieldName] : []}
      label='Senha'
      name='senha'
      {...formItemProps}
    >
      <Input.Password
        autoComplete='off'
        placeholder='Informe a senha'
        maxLength={12}
        id='INPUT_SENHA'
        {...inputProps}
      />
    </Form.Item>
  );
};

export default SenhaCadastro;
