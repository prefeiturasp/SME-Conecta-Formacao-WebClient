import { InfoCircleFilled } from '@ant-design/icons';
import { Form, FormItemProps, Tooltip } from 'antd';
import { FC } from 'react';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { Colors } from '~/core/styles/colors';

type EditorTextoProps = {
  nome: string;
  label?: string;
  mensagemTooltip?: string;
  required?: boolean;
  exibirTooltip?: boolean;
  disabled?: boolean;
  mensagemErro?: string;
  formItemProps?: FormItemProps;
};

const EditorTexto: FC<EditorTextoProps> = ({
  nome,
  label,
  mensagemTooltip,
  mensagemErro,
  required = true,
  exibirTooltip = false,
  disabled = false,
  formItemProps,
}) => {
  const config = {
    placeholder: label || '',
    disabled,
  };

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <Form.Item shouldUpdate>
      {(form) => {
        const temErro = !!form.getFieldError(nome)?.length;

        return (
          <Form.Item
            name={nome}
            label={label}
            rules={[{ required, message: mensagemErro || 'Campo obrigatório' }]}
            tooltip={{
              title: mensagemTooltip,
              icon: iconTooltip,
            }}
            {...formItemProps}
          >
            <JoditEditorSME hasError={temErro} config={config} />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default EditorTexto;
