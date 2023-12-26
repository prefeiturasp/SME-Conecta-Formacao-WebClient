import { Form, FormItemProps, InputProps } from 'antd';
import React, { useState } from 'react';
import InputEmail from '~/components/main/input/email';

type InputEmailInscricaoProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  validacaoEmail?: boolean;
};

const InputEmailInscricao: React.FC<InputEmailInscricaoProps> = ({
  inputProps,
  formItemProps,
  validacaoEmail,
}) => {
  const [required, setRequired] = useState<boolean>(false);

  return (
    <Form.Item {...formItemProps}>
      <InputEmail
        inputProps={inputProps}
        formItemProps={{
          rules: [
            { required: required },
            ({ getFieldValue }) => ({
              validator() {
                const email = getFieldValue('email');

                if (!email) {
                  setRequired(true);
                } else {
                  setRequired(false);
                }

                if (validacaoEmail && email && !email.includes('@edu')) {
                  return Promise.reject('O e-mail deve conter a extensão @edu');
                }

                return Promise.resolve();
              },
            }),
          ],
        }}
      />
    </Form.Item>
  );
};

export default InputEmailInscricao;