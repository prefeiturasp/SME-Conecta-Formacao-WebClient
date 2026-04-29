import { InfoCircleFilled } from '@ant-design/icons';
import { Button, Form, FormItemProps, Input, Tooltip } from 'antd';
import { FC } from 'react';
import { Colors } from '~/core/styles/colors';

type InputAnexoProps = {
  nome: string;
  label?: string;
  mensagemTooltip?: string;
  exibirTooltip?: boolean;
  disabled?: boolean;
  mensagemErro?: string;
  formItemProps?: FormItemProps;
};

const URL_PATTERN = /^https?:\/\/.+$/;

const buttonStyle = (disabled: boolean) => ({
  width: 124,
  height: 40,
  borderRadius: 4,
  border: 'none',
  background: disabled ? '#D9D9D9' : '#FF9A52',
  color: '#FFFFFF',
});

const InputAnexo: FC<InputAnexoProps> = ({
  nome,
  label,
  mensagemTooltip,
  exibirTooltip = false,
  disabled = false,
  mensagemErro = 'O link inserido é inválido.',
  formItemProps,
}) => {
  const iconTooltip = exibirTooltip ? (
    <Tooltip title={mensagemTooltip}>
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : null;

  return (
    <Form.Item
      label={
        <>
          {label}&ensp;{iconTooltip}
        </>
      }
      {...formItemProps}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <Form.Item
          name={nome}
          noStyle
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (!URL_PATTERN.test(value)) {
                  return Promise.reject(new Error(mensagemErro));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            style={{ flex: 1 }}
            placeholder="Insira o link de acesso aos documentos"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const valor = getFieldValue(nome);
            const linkValido = URL_PATTERN.test(valor ?? '');
            const botaoDesabilitado = disabled || !linkValido;

            return (
              <Button
                disabled={botaoDesabilitado}
                onClick={() => {
                  if (!botaoDesabilitado) {
                    window.open(valor, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={buttonStyle(botaoDesabilitado)}
              >
                Abrir link
              </Button>
            );
          }}
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default InputAnexo;