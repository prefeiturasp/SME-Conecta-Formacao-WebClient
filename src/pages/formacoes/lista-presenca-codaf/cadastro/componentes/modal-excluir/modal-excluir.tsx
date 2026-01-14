import { Button, Modal } from 'antd';
import React from 'react';

interface ModalExcluirProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalExcluir: React.FC<ModalExcluirProps> = ({ visible, onConfirm, onCancel, loading }) => {
  return (
    <Modal
      title={
        <span
          style={{
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          Excluir registro CODAF
        </span>
      }
      open={visible}
      onCancel={onCancel}
      centered
      width={600}
      footer={[
        <Button
          key='cancelar'
          onClick={onCancel}
          style={{
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Cancelar
        </Button>,
        <Button key='enviar' type='primary' onClick={onConfirm} loading={loading}>
          Excluir registro
        </Button>,
      ]}
    >
      <p>Esta ação não poderá ser desfeita. Deseja continuar?</p>
    </Modal>
  );
};

export default ModalExcluir;
