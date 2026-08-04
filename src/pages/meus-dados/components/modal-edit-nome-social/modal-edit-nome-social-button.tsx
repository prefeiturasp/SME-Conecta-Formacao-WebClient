import { FormInstance, Form, Button } from 'antd';
import React, { useState } from 'react';
import { ModalEditNomeSocial } from './modal-edit-nome-social';

type ModalEditNomeSocialButtonProps = {
  formPreview: FormInstance<{ nomeSocial: string }>;
};

export const ModalEditNomeSocialButton: React.FC<ModalEditNomeSocialButtonProps> = ({
  formPreview,
}) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const nomeSocial = Form.useWatch('nomeSocial', formPreview);

  const updateFields = (values: { nomeSocial: string }) => {
    formPreview.setFieldValue('nomeSocial', values?.nomeSocial);
  };

  return (
    <>
      <Button onClick={showModal}>{nomeSocial ? 'Alterar' : 'Adicionar'}</Button>
      {open && (
        <ModalEditNomeSocial
          updateFields={updateFields}
          initialValues={formPreview.getFieldsValue()}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
};
