import { ButtonEdit } from '~/components/lib/button/edit';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { ModalEditCargoFuncao } from './modal-edit-cargo-funcao';

type ModalEditCargoFuncaoButtonProps = {
  formPreview: FormInstance;
};

export const ModalEditCargoFuncaoButton: React.FC<ModalEditCargoFuncaoButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  return (
    <>
      <ButtonEdit descricaoTooltip='Editar Cargo/Função' onClickEditar={ showModal } podeEditar={ true } />
      {open && (
        <ModalEditCargoFuncao
          closeModal={ () => setOpen(false) }
        />
      )}
    </>
  );
};
