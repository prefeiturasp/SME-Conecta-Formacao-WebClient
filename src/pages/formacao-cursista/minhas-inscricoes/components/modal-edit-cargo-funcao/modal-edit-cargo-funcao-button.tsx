import { ButtonEdit } from '~/components/lib/button/edit';
import { FormInstance } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { ModalEditCargoFuncao } from './modal-edit-cargo-funcao';

type ModalEditCargoFuncaoButtonProps = {
  formPreview: FormInstance;
};

const ModalEditCargoFuncaoButton: React.FC<ModalEditCargoFuncaoButtonProps> = ({ formPreview }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  const updateFields = (values: { cargoCodigo: string, tipoVinculo: number }) => {
    formPreview.setFieldValue('cargoCodigo', values?.cargoCodigo);
    formPreview.setFieldValue('tipoVinculo', values?.tipoVinculo);
  };

  return (
    <>
      <ButtonEdit descricaoTooltip='Editar Cargo/Função' onClickEditar={ showModal } podeEditar={ true } />
      {open && (
        <ModalEditCargoFuncao
          initialValues={ formPreview.getFieldsValue() }
          updateFields={ updateFields }
          closeModal={ () => setOpen(false) }
        />
      )}
    </>
  );
};

export default ModalEditCargoFuncaoButton;
