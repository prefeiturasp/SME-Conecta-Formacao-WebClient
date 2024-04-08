import { ButtonEdit } from '~/components/lib/button/edit';
import React, { useContext, useState } from 'react';
import { ModalEditCargoFuncao } from './modal-edit-cargo-funcao';
import { InscricaoProps } from '../../listagem';
import { DataTableContext } from '~/components/lib/card-table/provider';

type ModalEditCargoFuncaoButtonProps = {
  record: InscricaoProps;
};

const ModalEditCargoFuncaoButton: React.FC<ModalEditCargoFuncaoButtonProps> = ({ record }) => {
  const { tableState } = useContext(DataTableContext);

  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);

  return (
    <>
      <ButtonEdit
        descricaoTooltip='Editar Cargo/Função'
        onClickEditar={showModal}
        podeEditar={record.situacao === 'Confirmada'}
      />
      {open && (
        <ModalEditCargoFuncao
          initialValues={record}
          closeModal={(updateTable: boolean) => {
            if (updateTable) {
              tableState.reloadData();
            }
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ModalEditCargoFuncaoButton;
