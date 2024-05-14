import { ButtonProps } from 'antd';
import React, { useState } from 'react';
import { ButtonImprimir } from '~/components/lib/printer-button';
import { CF_BUTTON_IMPRIMIR } from '~/core/constants/ids/button/intex';
import { ModalImprimir } from './modal-imprimir';

type ModalImprimirButtonProps = {
  propostaId: number;
  buttonProps?: ButtonProps;
  disabled?: boolean;
};

const ModalImprimirButton: React.FC<ModalImprimirButtonProps> = ({
  propostaId,
  buttonProps,
  disabled,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const showModal = () => setOpen(true);

  return (
    <>
      <ButtonImprimir
        id={CF_BUTTON_IMPRIMIR}
        onClick={showModal}
        disabled={disabled}
        {...buttonProps}
      />
      {open && (
        <ModalImprimir
          propostaId={propostaId}
          onFecharButton={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ModalImprimirButton;
