import { Button } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import ModalEditUnidade from './modal-edit-unidade';

type ModalEditUnidadeButtonProps = {
  formPreview: FormInstance;
};

const ModalEditUnidadeButton: React.FC<ModalEditUnidadeButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { nomeUnidade: string }) => {
    formPreview.setFieldValue('nomeUnidade', values?.nomeUnidade);
  };

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && (
        <ModalEditUnidade
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ModalEditUnidadeButton;
