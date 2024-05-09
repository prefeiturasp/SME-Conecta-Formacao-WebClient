import { ButtonProps, Space } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useState } from 'react';
import { ButtonPrimary } from '~/components/lib/button/primary';
import { CF_BUTTON_APROVAR, CF_BUTTON_RECUSAR } from '~/core/constants/ids/button/intex';
import { ModalAprovarRecusar } from './modal-aprovar-recusar';

type ModalAprovarRecusarButtonProps = {
  propostaId: number;
  buttonProps?: ButtonProps;
  disabled?: boolean;
};

type DefaultButtonProps = {
  id: string;
  label: 'Aprovar' | 'Recusar' | undefined;
};

type ModalStateProps = {
  openModal: boolean;
  tipoJustificativa?: DefaultButtonProps['label'];
};

export const ModalAprovarRecusarButton: React.FC<ModalAprovarRecusarButtonProps> = ({
  propostaId,
  buttonProps,
  disabled,
}) => {
  const formInstance = useFormInstance();
  const [modal, setModal] = useState<ModalStateProps>({ openModal: false });

  const labelAprovar = formInstance.getFieldsValue(true).labelAprovar;
  const labelRecusar = formInstance.getFieldsValue(true).labelRecusar;

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
      <DefaultButtonProps id={CF_BUTTON_APROVAR} label={labelAprovar} />
      <DefaultButtonProps id={CF_BUTTON_RECUSAR} label={labelRecusar} />
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
