import { Button } from 'antd';
import React, { useState } from 'react';
import ModalEditNovaSenha from './modal-edit-nova-senha';

const ModalEditNovaSenhaButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  return (
    <>
      <Button onClick={showModal}>Alterar</Button>
      {open && <ModalEditNovaSenha closeModal={() => setOpen(false)} />}
    </>
  );
};

export default ModalEditNovaSenhaButton;
