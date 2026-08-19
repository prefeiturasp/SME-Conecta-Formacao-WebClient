import React from 'react';
import { Modal, Button } from 'antd';

type ModalFinalizarCodafProps = {
  modalFinalizarVisible: boolean;
  onCancelarFinalizarCodaf: () => void;
  finalizandoCodaf: boolean;
  onConfirmarFinalizarCodaf: () => void;
};

const ModalFinalizarCodaf = ({
  modalFinalizarVisible,
  onCancelarFinalizarCodaf,
  finalizandoCodaf,
  onConfirmarFinalizarCodaf,
}: ModalFinalizarCodafProps) => (
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
  </Modal>
);

export default ModalFinalizarCodaf;
