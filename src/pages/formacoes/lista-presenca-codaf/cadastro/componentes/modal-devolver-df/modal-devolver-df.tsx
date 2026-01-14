import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface ModalEnviarDFProps {
  visible: boolean;
  onConfirm: (justificativa: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ModalDevolverDF: React.FC<ModalEnviarDFProps> = ({
  visible,
  onConfirm,
  onCancel,
  loading,
}) => {
  const [justificativa, setJustificativa] = useState('');

  useEffect(() => {
    if (!visible) {
      setJustificativa('');
    }
  }, [visible]);
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
          Sugestões de ajustes para o CODAF
        </span>
      }
      open={visible}
      onCancel={onCancel}
      centered
      width={800}
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
        <Button
          key='enviar'
          type='primary'
          onClick={() => onConfirm(justificativa)}
          loading={loading}
          disabled={!justificativa.trim()}
        >
          Devolver CODAF
        </Button>,
      ]}
    >
      <br></br>
      <p>Insira as sugestões de melhorias para o CODAF antes de encaminhar à área promotora.</p>
      <br></br>
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor='justificativa'
          style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
        >
          Justifique (obrigatório)*
        </label>
        <textarea
          id='justificativa'
          placeholder='Digite...'
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalDevolverDF;
