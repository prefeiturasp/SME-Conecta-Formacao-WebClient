import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React from 'react';

export const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditarLinhaTabelaProps {
  index: number;
}

export const EditarLinhaTabela: React.FC<EditarLinhaTabelaProps> = ({ index, ...props }) => {
  const form = Form.useFormInstance();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
