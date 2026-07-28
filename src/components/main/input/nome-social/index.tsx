import { FormItemProps } from 'antd/es/form';
import { InputProps } from 'antd/es/input';
import { Input } from 'antd';
import { CF_INPUT_NOME_SOCIAL } from '~/core/constants/ids/input';
import { Form } from 'antd';

type InputNomeSocialProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
};

export const InputNomeSocial: React.FC<InputNomeSocialProps> = ({ inputProps, formItemProps }) => {
  return (
    <Form.Item label='Nome Social' name='nomeSocial' {...formItemProps}>
        <Input id={CF_INPUT_NOME_SOCIAL} placeholder='Exemplo: João da Silva' {...inputProps} />
    </Form.Item>
  );
}