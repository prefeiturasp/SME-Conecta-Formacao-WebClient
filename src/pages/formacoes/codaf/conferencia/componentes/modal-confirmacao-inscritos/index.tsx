import { Button, Modal } from 'antd';
import React from 'react';

export interface ModalConfirmacaoInscritosConferenciaProps {
  visivel: boolean;
  onClose: () => void;
  onClickInscricoes: () => void;
  onClickContinuar: () => void;
}

export const ModalConfirmacaoInscritosConferencia: React.FC<
  ModalConfirmacaoInscritosConferenciaProps
> = ({ visivel, onClose, onClickInscricoes, onClickContinuar }) => {
  return (
    <Modal
      title={
        <span style={{ fontWeight: 700, fontSize: '20px', lineHeight: '100%' }}>Atenção</span>
      }
      open={visivel}
      onCancel={onClose}
      centered
      width={600}
      footer={[
        <Button
          key='inscricoes'
          onClick={onClickInscricoes}
          style={{ borderColor: '#ff6b35', color: '#ff6b35', fontWeight: 500 }}
        >
          Ir para tela de inscrições
        </Button>,
        <Button key='continuar' type='primary' onClick={onClickContinuar}>
          Continuar registros
        </Button>,
      ]}
    >
      <p style={{ marginTop: 16, marginBottom: 16 }}>
        Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na
        formação. Caso necessário, você pode realizar o cadastro pela tela de inscrições.
      </p>
    </Modal>
  );
};
