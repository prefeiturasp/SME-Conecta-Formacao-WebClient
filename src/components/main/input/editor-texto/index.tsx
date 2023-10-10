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
  exibirTooltip?: boolean;
};

const EditorTexto: FC<EditorTextoProps> = ({
  nome,
  label,
  mensagemTooltip,
  required = true,
  exibirTooltip = false,
}) => {
  const config = {
    placeholder: label ?? '',
  };
  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <Form.Item
      shouldUpdate
      tooltip={{
        title: mensagemTooltip,
        icon: iconTooltip,
      }}
    >
      {(form) => {
        const temErro = !!form.getFieldError(nome)?.length;

        return (
          <Form.Item name={nome} label={label} rules={[{ required: required }]}>
            <JoditEditorSME hasError={temErro} config={config} />
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export default EditorTexto;
