import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditEmail from './modal-edit-email';

type ModalEditEmailButtonProps = {
  formPreview: FormInstance;
};

const ModalEditEmailButton: React.FC<ModalEditEmailButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { email: string }) => {
    formPreview.setFieldValue('email', values?.email);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditEmail
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditEmailButton;
