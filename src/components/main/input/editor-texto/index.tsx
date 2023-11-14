import { InfoCircleFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { FC } from 'react';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { Colors } from '~/core/styles/colors';

type EditorTextoProps = {
  nome: string;
  label?: string;
  mensagemTooltip?: string;
  required?: boolean;
  exibirTooltip?: boolean;
  disabeld?: boolean;
};

const EditorTexto: FC<EditorTextoProps> = ({
  nome,
  label,
  mensagemTooltip,
  required = true,
  exibirTooltip = false,
  disabeld = false,
}) => {
  const config = {
    placeholder: label || '',
    disabled: disabeld,
  };

  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
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
            rules={[{ required }]}
            tooltip={{
              title: mensagemTooltip,
              icon: iconTooltip,
            }}
          >
            <JoditEditorSME hasError={temErro} config={config} />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default EditorTexto;
