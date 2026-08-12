import { Button, Modal } from 'antd';
import React from 'react';

interface ModalAvisoNovoRegistroCodafProps {
  visivel: boolean;
  onClose: () => void;
  onClickInscricoes: () => void;
  onClickContinuar: () => void;
}

export const ModalAvisoNovoRegistroCodaf: React.FC<ModalAvisoNovoRegistroCodafProps> = ({
  visivel,
  onClose,
  onClickInscricoes,
  onClickContinuar,
}) => {
  return (
    <Modal
      title={
        <span style={{ fontWeight: 700, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>
          Atenção!
        </span>
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
          Continuar registro
        </Button>,
      ]}
    >
      <br />
      <p>
        Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na
        formação. Caso necessário, você pode realizar o cadastro pela tela de inscrições.
      </p>
      <br />
    </Modal>
  );
};