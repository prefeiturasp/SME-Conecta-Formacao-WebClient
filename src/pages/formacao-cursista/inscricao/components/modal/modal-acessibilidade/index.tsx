import { Button, Modal } from 'antd';
import React from 'react';

type ModalAcessibilidadeProps = {
  open: boolean;
  onCancel: () => void;
  onNaoSalvar: () => void;
  onSalvar: () => void;
};

export const ModalAcessibilidade: React.FC<ModalAcessibilidadeProps> = ({
  open,
  onCancel,
  onNaoSalvar,
  onSalvar,
}) => {
  return (
    <Modal
      open={open}
      title={
        <span
          style={{
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}
        >
          <br />
          Salvar informações de acessibilidade no seu cadastro?
        </span>
      }
      centered
      width={670}
      onCancel={onCancel}
      styles={{
        footer: {
          display: 'flex',
          gap: '8px',
          paddingTop: '8px',
          paddingBottom: '8px',
        },
      }}
      footer={[
        <Button
          key='nao-salvar'
          onClick={onNaoSalvar}
          style={{
            flex: 1,
            margin: 0,
            borderColor: '#ff6b35',
            color: '#ff6b35',
            fontWeight: 500,
          }}
        >
          Não salvar
        </Button>,
        <Button
          key='salvar'
          type='primary'
          onClick={onSalvar}
          style={{ flex: 1, margin: 0 }}
        >
          Salvar informações
        </Button>,
      ]}
    >
      <br />
      <p>
        Você informou necessidades de acessibilidade para esta formação. Deseja salvar essas
        informações no seu cadastro para usar automaticamente em próximas inscrições?
      </p>
      <p>
        {' '}
        Você poderá atualizar ou remover essas informações a qualquer momento acessando a aba{' '}
        <b>&quot;meus dados&quot;</b>.
      </p>
    </Modal>
  );
};
