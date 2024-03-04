import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { ModalEditNome } from './modal-edit-nome';

type ModalEditNomeButtonProps = {
  formPreview: FormInstance;
};

export const ModalEditNomeButton: React.FC<ModalEditNomeButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { usuarioNome: string }) => {
    formPreview.setFieldValue('usuarioNome', values?.usuarioNome);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditNome
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};