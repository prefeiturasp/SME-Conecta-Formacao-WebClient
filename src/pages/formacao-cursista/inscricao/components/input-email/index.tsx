import { FormItemProps, InputProps } from 'antd';
import React, { useState } from 'react';
import InputEmail from '~/components/main/input/email';

type InputEmailInscricaoProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  validacaoEmail?: boolean;
};

const InputEmailInscricao: React.FC<InputEmailInscricaoProps> = ({ inputProps, formItemProps }) => {
  const [required, setRequired] = useState<boolean>(false);

  return (
    <InputEmail
      inputProps={inputProps}
      formItemProps={{
        rules: [
          { required: required },
          ({ getFieldValue }) => ({
            validator() {
              const email = getFieldValue('usuarioEmail');

              if (!email) {
                setRequired(true);
              } else {
                setRequired(false);
              }

              return Promise.resolve();
            },
          }),
        ],
        ...formItemProps,
      }}
    />
  );
};

export default InputEmailInscricao;
