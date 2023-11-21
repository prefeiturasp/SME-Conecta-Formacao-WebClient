import React from 'react';
import { Modal } from 'antd';
import { ERRO_CAMPOS_OBRIGATORIOS } from '~/core/constants/mensagens';
import { Colors } from '~/core/styles/colors';

type ModalErroPropostaPropos = {
  erros: Array<string>;
  closeModal: () => void;
};

const ModalErroProposta: React.FC<ModalErroPropostaPropos> = ({ erros, closeModal }) => {
  return (
    <Modal
      title={ERRO_CAMPOS_OBRIGATORIOS}
      centered
      open
      onOk={closeModal}
      closeIcon
      width={1000}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      {erros.map((item, index) => (
        <p key={item} style={{ color: Colors.ERROR }}>
          {index + 1} - {item}
        </p>
      ))}
    </Modal>
  );
};

export default ModalErroProposta;
