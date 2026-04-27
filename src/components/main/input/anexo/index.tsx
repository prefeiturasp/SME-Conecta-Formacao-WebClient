import { InfoCircleFilled, LinkOutlined } from '@ant-design/icons';
import { Button, Form, FormItemProps, Input, Space, Tooltip } from 'antd';
import { FC } from 'react';
import { Colors } from '~/core/styles/colors';

type InputAnexoProps = {
  nome: string;
  label?: string;
  mensagemTooltip?: string;
  required?: boolean;
  exibirTooltip?: boolean;
  disabled?: boolean;
  mensagemErro?: string;
  formItemProps?: FormItemProps;
};

const InputAnexo: FC<InputAnexoProps> = ({
  nome,
  label,
  mensagemTooltip,
  exibirTooltip = false,
  disabled = false,
  formItemProps,
}) => {

  const iconTooltip = exibirTooltip ? (
    <Tooltip title={mensagemTooltip}>
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : null;

  return (
    <Form.Item
      name={nome}
      label={
        <>
          {label}&ensp;{iconTooltip}
        </>
      }
      rules={[
        {
          pattern: /^https?:\/\/.+$/,
          message: 'O link inserido é inválido.',
        },
      ]}
      {...formItemProps}
    >
      <Input
        placeholder="Insira o link de acesso aos documentos"
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default InputAnexo;