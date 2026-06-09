import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { ModalEditTelefone } from './modal-edit-telefone.tsx';

type ModalEditTelefoneButtonProps = {
  formPreview: FormInstance;
};

export const ModalEditTelefoneButton: React.FC<ModalEditTelefoneButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { telefone: string }) => {
    formPreview.setFieldValue('telefone', values?.telefone);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditTelefone
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};
