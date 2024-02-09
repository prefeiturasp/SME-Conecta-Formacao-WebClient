import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useState } from 'react';
import { CF_INPUT_CODIGO_EOL } from '~/core/constants/ids/input';
import codigoUeService from '~/core/services/codigo-ue-service';

type InputCodigoEolUEProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputCodigoEolUE: React.FC<InputCodigoEolUEProps> = ({ inputProps, formItemProps }) => {
  const form = useFormInstance();
  const uesWatch = Form.useWatch('ues', form);
  const [loadingCodigoEOL, setLoadingCodigoEOL] = useState<boolean>(false);

  const getCodigoEol = (value: string) => {
    setLoadingCodigoEOL(true);
    codigoUeService
      .obterUePorCodigoEOL(value)
      .then((resposta: any) => {
        const data = resposta.dados;

        form.setFieldsValue({ nomeUe: data.nomeEscola });
      })
      .finally(() => setLoadingCodigoEOL(false));
  };

  const campoEhObrigatorio = () => {
    if (uesWatch) {
      return false;
    }

    return true;
  };

  return (
    <Form.Item
      label='Código EOL da UE'
      name='codigoUE'
      dependencies={['ues']}
      rules={[{ required: campoEhObrigatorio() }]}
      {...formItemProps}
    >
      <Input.Search
        id={CF_INPUT_CODIGO_EOL}
        loading={loadingCodigoEOL}
        placeholder='Informe o código EOL da UE'
        onSearch={(e) => {
          !!e ? getCodigoEol(e) : null;
        }}
        onChange={(e) => {
          const value = e.target.value;

          if (!!value.length || !value.length) {
            form.setFieldValue('nomeUe', '');
          }
        }}
        {...inputProps}
      />
    </Form.Item>
  );
};
export default InputCodigoEolUE;
