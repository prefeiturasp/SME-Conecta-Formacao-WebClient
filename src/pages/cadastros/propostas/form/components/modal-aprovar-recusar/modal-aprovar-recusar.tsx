import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { validateMessages } from '~/core/constants/validate-messages';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import {
  aprovarConsideracoesAdminDf,
  aprovarConsideracoesPareceristas,
  obterSugestoesAprovadas,
  obterSugestoesRecusadas,
  recusarConsideracoesAdminDf,
  recusarConsideracoesPareceristas,
} from '~/core/services/proposta-service';
import { ModalAprovarRecusarConteudo } from './modal-aprovar-recusar-conteudo';
import { ModalAprovarRecusarConteudoInicial } from './modal-aprovar-recusar-conteudo-inicial';

const mockSugestoes = [
  {
    id: 1,
    descricao: 'SUGESTAO MOCK 1',
  },
  {
    id: 2,
    descricao: 'SUGESTAO MOCK 2',
  },
];

type ModalAprovarRecusarProps = {
  propostaId: number;
  onFecharButton: () => void;
  tipoJustificativa:
    | 'Aprovar'
    | 'Sugerir aprovação'
    | 'Recusar'
    | 'Sugerir recusa'
    | undefined
    | string;
};

export const ModalAprovarRecusar: React.FC<ModalAprovarRecusarProps> = ({
  propostaId,
  onFecharButton,
  tipoJustificativa,
}) => {
  const [form] = useForm();

  const [sugestoes, setSugestoes] = useState<string>();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);

  const aprovarSelecionado =
    tipoJustificativa === 'Aprovar' || tipoJustificativa === 'Sugerir aprovação';

  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

  const temSugestoes = !!sugestoes?.length;

  const salvar = () => {
    const valoresSalvar = form.getFieldsValue(true);
    const justificativa = valoresSalvar?.justificativa;

    let endpoint;

    if (ehPerfilAdminDf) {
      endpoint = aprovarSelecionado ? aprovarConsideracoesAdminDf : recusarConsideracoesAdminDf;
    } else {
      endpoint = aprovarSelecionado
        ? aprovarConsideracoesPareceristas
        : recusarConsideracoesPareceristas;
    }

    endpoint(propostaId, justificativa).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Justificativa enviada com sucesso!',
        });
        onFecharButton();
      }
    });
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      salvar();
    });
  };

  const fecharModal = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: 'Você não salvou a justificativa, deseja descartar a alteração?',
        onOk() {
          form.resetFields();
          onFecharButton();
        },
        okText: 'Sim',
        cancelText: 'Não',
      });
    } else {
      form.resetFields();
      onFecharButton();
    }
  };

  const montarJustificativasEdicao = () => {
    if (ehPerfilAdminDf && temSugestoes) {
      return (
        <>
          {mockSugestoes.map((item, index) => (
            <React.Fragment key={item.id}>
              <ModalAprovarRecusarConteudo
                index={index}
                sugestao={item}
                carregarSugestoes={carregarSugestoes}
              />
            </React.Fragment>
          ))}
        </>
      );
    }
  };

  const montarJustificativaInicial = () => {
    return (
      <ModalAprovarRecusarConteudoInicial
        aprovarSelecionado={aprovarSelecionado}
        onClickSalvar={validateFields}
      />
    );
  };

  const carregarSugestoes = async () => {
    if (ehPerfilAdminDf) {
      const endpoint = aprovarSelecionado ? obterSugestoesAprovadas : obterSugestoesRecusadas;
      const resposta = await endpoint(propostaId);

      if (resposta.sucesso) {
        const dados = resposta.dados;
        setSugestoes(dados);
      }
    }
  };

  useEffect(() => {
    carregarSugestoes();
  }, [ehPerfilAdminDf]);

  return (
    <Modal
      open
      centered
      destroyOnClose
      closable={false}
      cancelText='Fechar'
      okButtonProps={{
        hidden: true,
      }}
      onCancel={fecharModal}
      title='Preenchimento das justificativas'
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        {montarJustificativaInicial()}
        {montarJustificativasEdicao()}
      </Form>
    </Modal>
  );
};
