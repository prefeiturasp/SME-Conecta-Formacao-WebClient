import { ButtonProps, Space } from 'antd';
import React, { useState } from 'react';
import { ButtonPrimary } from '~/components/lib/button/primary';
import { CF_BUTTON_APROVAR, CF_BUTTON_RECUSAR } from '~/core/constants/ids/button/intex';
import { PropostaFormDTO } from '~/core/dto/proposta-dto';
import { ModalAprovarRecusar } from './modal-aprovar-recusar';

type ModalAprovarRecusarButtonProps = {
  propostaId: number;
  buttonProps?: ButtonProps;
  disabled?: boolean;
  formInitialValues: PropostaFormDTO;
};

type DefaultButtonProps = {
  id: string;
  label: 'Aprovar' | 'Recusar' | undefined | string;
};

type ModalStateProps = {
  openModal: boolean;
  tipoJustificativa?: DefaultButtonProps['label'];
};

export const ModalAprovarRecusarButton: React.FC<ModalAprovarRecusarButtonProps> = ({
  propostaId,
  buttonProps,
  disabled,
  formInitialValues,
}) => {
  const [modal, setModal] = useState<ModalStateProps>({ openModal: false });

  const showModal = ({ openModal, tipoJustificativa }: ModalStateProps) => {
    if (modal) {
      setModal({ openModal, tipoJustificativa });
    }
  };

  const DefaultButtonProps: React.FC<DefaultButtonProps> = ({ id, label }) => {
    return (
      <ButtonPrimary
        block
        id={id}
        onClick={() => showModal({ openModal: true, tipoJustificativa: label })}
        disabled={disabled}
        {...buttonProps}
      >
        {label}
      </ButtonPrimary>
    );
  };

  return (
    <Space>
      <DefaultButtonProps id={CF_BUTTON_APROVAR} label={formInitialValues?.labelAprovar} />
      <DefaultButtonProps id={CF_BUTTON_RECUSAR} label={formInitialValues?.labelRecusar} />
      {modal?.openModal && (
        <ModalAprovarRecusar
          tipoJustificativa={modal?.tipoJustificativa}
          propostaId={propostaId}
          onFecharButton={() => {
            setModal({ openModal: false });
          }}
        />
      )}
    </Space>
  );
};
