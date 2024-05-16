import { Form, FormItemProps, Input, InputProps } from 'antd';
import React from 'react';
import { TELEFONE_NAO_INFORMADO } from '~/core/constants/mensagens';
import { maskTelefone } from '~/core/utils/functions';

type InputTelefoneProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputTelefone: React.FC<InputTelefoneProps> = ({ inputProps, formItemProps }) => {
  const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

  const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removerTudoQueNaoEhDigito(e?.target?.value);
    return value ? maskTelefone(value) : value;
  };

  return (
    <Form.Item
      label='Telefone'
      name='telefone'
      getValueFromEvent={getValueFromEvent}
      rules={[
        { required: !!formItemProps?.required, message: TELEFONE_NAO_INFORMADO },
        {
          message:
            'Telefone inválido, você deve digitar o DDD com dois dígitos e o telefone com 8 ou 9 dígitos',
          validator: (_, value) => {
            if (!value) return Promise.resolve();

            const regex = /(?=\s(9)).*/;
            const comecaComNove = regex.test(value);

            const ehCelular = comecaComNove && value?.length === 15;
            const ehTelefone = !comecaComNove && value?.length === 14;

            if (ehCelular || ehTelefone) return Promise.resolve();

            return Promise.reject();
          },
        },
      ]}
      {...formItemProps}
    >
      <Input placeholder='(XX) XXXXX-XXXX' maxLength={15} {...inputProps} />
    </Form.Item>
  );
};

export default InputTelefone;
