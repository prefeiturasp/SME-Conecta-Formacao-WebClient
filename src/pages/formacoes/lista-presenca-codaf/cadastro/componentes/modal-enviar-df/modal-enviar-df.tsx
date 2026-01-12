import { Button, Modal } from 'antd';
import React from 'react';

interface ModalEnviarDFProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalEnviarDF: React.FC<ModalEnviarDFProps> = ({ visible, onConfirm, onCancel, loading }) => {
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
          Deseja enviar o CODAF para análise da DF?
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
          Enviar para DF
        </Button>,
      ]}
    >
      <br />
      <p>O registro não poderá ser modificado enquanto estiver com a situação &quot;Aguardando DF&quot;</p>
      <br />
    </Modal>
  );
};

export default ModalEnviarDF;
