import { Form, Tooltip } from 'antd';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { FC } from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Colors } from '~/core/styles/colors';

type EditorTextoProps = {
  nome: string;
  label?: string;
  mensagemTooltip?: string;
  required?: boolean;
};

const EditorTexto: FC<EditorTextoProps> = ({ nome, label, mensagemTooltip, required = true }) => {
  const config = {
    placeholder: label ?? '',
  };
  const iconTooltip = required ? (
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
            rules={[{ required: required }]}
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
