import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditTipoEmailEducacional from './modal-edit-tipo-email-educacional';

type ModalEditTipoEmailButtonProps = {
  formPreview: FormInstance;
};

const ModalEditTipoEmailEducacionalButton: React.FC<ModalEditTipoEmailButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);
  const showModal = () => setOpen(true);
  const updateFields = (values: { tipoEmail: number }) => formPreview.setFieldValue('tipoEmail', values?.tipoEmail);

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditTipoEmailEducacional
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditTipoEmailEducacionalButton;
