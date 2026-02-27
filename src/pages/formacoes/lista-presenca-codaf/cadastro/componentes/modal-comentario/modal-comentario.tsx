import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ComentarioCodafDTO } from '~/core/services/codaf-lista-presenca-service';

interface ModalComentarioProps {
  visible: boolean;
  onClose: () => void;
  comentario: ComentarioCodafDTO | null;
}

const ModalComentario: React.FC<ModalComentarioProps> = ({ visible, onClose, comentario }) => {
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
      onCancel={onClose}
      centered
      width={800}
      footer={[
        <Button
          key='fechar'
          type='primary'
          onClick={onClose}
          style={{
            fontWeight: 500,
          }}
        >
          Fechar
        </Button>,
      ]}
    >
      <br />
      <p>Estas são as informações retornadas pela pessoa administradora.</p>
      <br />
      {comentario && (
        <div>
          {/* <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Autor
            </label>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {comentario.criadoPor}
            </div>
          </div> */}

          {/* <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Data</label>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {dayjs(comentario.criadoEm).format('DD/MM/YYYY HH:mm')}
            </div>
          </div> */}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              <strong>Comentário</strong>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                minHeight: '100px',
              }}
            >
              {comentario.comentario}
            </div>
          </div>

          <div>
            INSERIDO por {comentario.criadoPor} (nº RF {comentario.criadoLogin}) em{' '}
            {dayjs(comentario.criadoEm).format('DD/MM/YYYY HH:mm')}{' '}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalComentario;
