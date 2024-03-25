import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditEmailEducacional from './modal-edit-email-educacional';

type ModalEditEmailButtonProps = {
  formPreview: FormInstance;
};

const ModalEditEmailEducacionalButton: React.FC<ModalEditEmailButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { emailEducacional: string }) => {
    formPreview.setFieldValue('emailEducacional', values?.emailEducacional);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditEmailEducacional
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditEmailEducacionalButton;
