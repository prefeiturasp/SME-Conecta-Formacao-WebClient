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
          Confirmar exclusão
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
          Não
        </Button>,
        <Button key='enviar' type='primary' onClick={onConfirm} loading={loading}>
          Sim
        </Button>,
      ]}
    >
      <p>Tem certeza que deseja excluir este registro?</p>
    </Modal>
  );
};

export default ModalExcluir;
