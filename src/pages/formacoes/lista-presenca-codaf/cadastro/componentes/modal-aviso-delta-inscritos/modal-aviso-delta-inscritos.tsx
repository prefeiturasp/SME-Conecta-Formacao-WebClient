import { Button, Modal } from 'antd';
import React from 'react';
import { DeltaInscritosDTO } from '~/core/services/codaf-lista-presenca-service';

interface ModalAvisoDeltaInscritosProps {
  visible: boolean;
  nomeFormacao: string;
  deltaInscritos: DeltaInscritosDTO | null;
  onCancel: () => void;
  onAtualizar: () => void;
}

const ModalAvisoDeltaInscritos: React.FC<ModalAvisoDeltaInscritosProps> = ({
  visible,
  nomeFormacao,
  deltaInscritos,
  onCancel,
  onAtualizar,
}) => {
  if (!deltaInscritos) return null;

  const temNovos = deltaInscritos.totalNovos > 0;
  const temRemovidos = deltaInscritos.totalRemovidos > 0;

  const renderListaCancelados = () => (
    <div style={{ marginTop: '24px' }}>
      <p style={{ fontWeight: 700, marginBottom: '8px', color: '#42474A' }}>
        Lista de inscrições canceladas na formação:
      </p>
      <div>
        <p style={{ fontWeight: 700, marginBottom: '8px', color: '#42474A' }}>
          Cursistas com inscrições canceladas:
        </p>
        <ul style={{ paddingLeft: '20px', margin: 0, color: '#42474A' }}>
          {deltaInscritos.inscritosRemovidos.map((inscrito) => (
            <li key={inscrito.id}>
              [{inscrito.nome} - {inscrito.documento}]
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  let conteudo = null;

  if (temNovos && temRemovidos) {
    conteudo = (
      <>
        <p style={{ color: '#42474A', margin: 0 }}>
          A lista de inscritos foi atualizada.<br />
          Novas inscrições foram adicionadas e algumas canceladas. Para salvar as alterações no CODAF, preencha as informações obrigatórias dos novos cursistas clicando em "atualizar inscritos"
        </p>
        {renderListaCancelados()}
      </>
    );
  } else if (temNovos) {
    conteudo = (
      <p style={{ color: '#42474A', margin: 0 }}>
        A lista de inscritos na formação foi atualizada. Para salvar as alterações do CODAF, é necessário inserir informações obrigatórias dos novos cursistas inseridos, atualize as informações clicando em “atualizar inscritos”.
      </p>
    );
  } else if (temRemovidos) {
    conteudo = (
      <>
        <p style={{ color: '#42474A', margin: 0 }}>
          Algumas inscrições foram canceladas na formação <strong>{nomeFormacao}</strong>. Clique no botão "atualizar inscritos" para reprocessar a lista.
        </p>
        {renderListaCancelados()}
      </>
    );
  }

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
          Atenção!
        </span>
      }
      open={visible}
      onCancel={onCancel}
      centered
      width={700}
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
          key='atualizar' 
          type='primary' 
          onClick={onAtualizar} 
          style={{ fontWeight: 700 }}
        >
          Atualizar inscritos
        </Button>,
      ]}
    >
      <br />
      {conteudo}
      <br />
    </Modal>
  );
};

export default ModalAvisoDeltaInscritos;