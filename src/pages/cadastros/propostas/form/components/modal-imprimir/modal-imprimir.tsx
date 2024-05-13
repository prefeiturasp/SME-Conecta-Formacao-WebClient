import React from 'react';
import Modal from '~/components/lib/modal';

type ModalImprimirProps = {
  propostaId: number;
  onFecharButton: () => void;
};

export const ModalImprimir: React.FC<ModalImprimirProps> = ({ propostaId, onFecharButton }) => {
  const handleImprimir = () => {
    console.log(propostaId);

    // obterRelatorioLaudaPublicacao,
    // obterRelatorioLaudaCompleta,

    // devolverProposta(propostaId)
    //   .then((resposta) => {
    //     if (resposta.sucesso) {
    //       notification.success({
    //         message: 'Sucesso',
    //         description: 'Proposta devolvida com sucesso!',
    //       });
    //       onFecharButton();
    //     }
    //   })
  };

  const handleFechar = () => {
    onFecharButton();
  };

  return (
    <Modal
      open
      title='Impressão de relatório'
      onOk={handleImprimir}
      onCancel={handleFechar}
      centered
      destroyOnClose
      okText='Gerar'
      cancelText='Cancelar'
    >
      <h1>CRIAR OPCOES PRA IMPRIMIR RELATORIO</h1>
    </Modal>
  );
};
