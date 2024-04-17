import React, { useState } from 'react';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { ModalDevolver } from './modal-devolver';
import { ButtonProps } from 'antd';
import { CF_BUTTON_DEVOLVER_PROPOSTA } from '~/core/constants/ids/button/intex';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';

type ModalDevolverButtonProps = {
  propostaId: number;
  buttonProps?: ButtonProps;
  disabled?: boolean;
}

const ModalDevolverButton: React.FC<ModalDevolverButtonProps> = ({ propostaId, buttonProps, disabled }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const showModal = () => setOpen(true);

  return (
    <>
      <ButtonSecundary
        id={ CF_BUTTON_DEVOLVER_PROPOSTA }
        onClick={ showModal }
        disabled={ disabled }
        {...buttonProps}
      >
        Devolver
      </ButtonSecundary>
      {open && (
        <ModalDevolver
          propostaId={ propostaId }
          onFecharButton={() => {
            setOpen(false);
            navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
          }}
        />
      )}
    </>
  );
};

export default ModalDevolverButton;
