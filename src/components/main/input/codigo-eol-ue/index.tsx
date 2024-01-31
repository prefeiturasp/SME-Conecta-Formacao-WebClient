import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import { CF_INPUT_CODIGO_EOL } from '~/core/constants/ids/input';

type InputCodigoEolUEProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

const InputCodigoEolUE: React.FC<InputCodigoEolUEProps> = ({ inputProps, formItemProps }) => {
  const form = useFormInstance();
  const uesWatch = Form.useWatch('ues', form);

  const campoEhObrigatorio = () => {
    if (uesWatch?.length) {
      return false;
    }

    return true;
  };

  return (
    <Form.Item
      label='Código EOL da UE'
      name='codigoEolUe'
      dependencies={['ues']}
      rules={[{ required: campoEhObrigatorio() }]}
      {...formItemProps}
    >
      <Input id={CF_INPUT_CODIGO_EOL} placeholder='Informe o código EOL da UE' {...inputProps} />
    </Form.Item>
  );
};
export default InputCodigoEolUE;
