import { Form } from 'antd';
import JoditEditorSME from '~/components/lib/inputs/editor/index.tsx';
import { FC } from 'react';

type EditorTextoProps = {
  nome: string;
  label?: string;
  required?: boolean;
};

const EditorTexto: FC<EditorTextoProps> = ({ nome, label, required = true }) => {
  const config = {
    placeholder: label ?? '',
  };
  return (
    <Form.Item shouldUpdate>
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
