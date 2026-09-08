import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox } from 'antd';

type ModalFinalizarCodafProps = {
  modalFinalizarVisible: boolean;
  onCancelarFinalizarCodaf: () => void;
  finalizandoCodaf: boolean;
  onConfirmarFinalizarCodaf: () => void;
  exibirConfirmacaoCiencia?: boolean;
  onVisualizarCodaf?: () => void;
};

const ModalFinalizarCodaf = ({
  modalFinalizarVisible,
  onCancelarFinalizarCodaf,
  finalizandoCodaf,
  onConfirmarFinalizarCodaf,
  exibirConfirmacaoCiencia = false,
  onVisualizarCodaf,
}: ModalFinalizarCodafProps) => {
  const [confirmacaoCiencia, setConfirmacaoCiencia] = useState(false);

  useEffect(() => {
    if (!modalFinalizarVisible) {
      setConfirmacaoCiencia(false);
    }
  }, [modalFinalizarVisible]);

  return (
    <Modal
      title={
        <span
          style={{
            fontFamily: 'Roboto',
            fontWeight: 700,
            fontStyle: 'normal',
            fontSize: 20,
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          Finalização de CODAF
        </span>
      }
      open={modalFinalizarVisible}
      onCancel={onCancelarFinalizarCodaf}
      width={672}
      styles={{
        content: {
          padding: 24,
          borderRadius: 4,
        },
        header: {
          marginBottom: 32,
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      footer={[
        <Button
          key='cancelar'
          onClick={onCancelarFinalizarCodaf}
          disabled={finalizandoCodaf}
          style={{
            fontWeight: 700,
            color: '#ff9a52',
            borderColor: '#ff9a52',
            backgroundColor: '#FFFFFF',
          }}
        >
          Cancelar
        </Button>,
        <Button
          key='finalizar'
          type='primary'
          onClick={onConfirmarFinalizarCodaf}
          loading={finalizandoCodaf}
          disabled={exibirConfirmacaoCiencia ? !confirmacaoCiencia : false}
          style={{
            fontWeight: 700,
            backgroundColor: '#ff9a52',
            borderColor: '#ff9a52',
          }}
        >
          Finalizar registro CODAF
        </Button>,
      ]}
    >
      <p
        style={{
          fontFamily: 'Roboto',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: 14,
          lineHeight: '100%',
          letterSpacing: '0%',
          margin: 0,
        }}
      >
        Este registro não possui aprovações. Após a finalização ele não poderá ser editado nem
        excluído.
        <br />
        Verifique o CODAF antes de finalizar.
      </p>

      {exibirConfirmacaoCiencia && (
        <div style={{ marginTop: 24 }}>
          <Checkbox
            checked={confirmacaoCiencia}
            onChange={(e) => setConfirmacaoCiencia(e.target.checked)}
            style={{ fontFamily: 'Roboto', fontSize: 14 }}
          >
            Confirmo que todos os dados inseridos no{' '}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onVisualizarCodaf) onVisualizarCodaf();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onVisualizarCodaf) onVisualizarCodaf();
                }
              }}
              style={{ color: '#ff6b35', cursor: 'pointer', fontWeight: 600 }}
            >
              Registro CODAF
            </span>{' '}
            estÃ£o corretos.
          </Checkbox>
        </div>
      )}
    </Modal>
  );
};

export default ModalFinalizarCodaf;



