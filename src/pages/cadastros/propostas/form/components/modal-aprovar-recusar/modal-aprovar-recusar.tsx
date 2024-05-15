import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { validateMessages } from '~/core/constants/validate-messages';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import {
  aprovarConsideracoesAdminDf,
  aprovarConsideracoesPareceristas,
  recusarConsideracoesAdminDf,
  recusarConsideracoesPareceristas,
} from '~/core/services/proposta-service';
import { ModalAprovarRecusarConteudoInicial } from './modal-aprovar-recusar-conteudo-inicial';

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
  carregarDados: () => void;
};

export const ModalAprovarRecusar: React.FC<ModalAprovarRecusarProps> = ({
  propostaId,
  onFecharButton,
  tipoJustificativa,
  carregarDados,
}) => {
  const [form] = useForm();
  const formInstance = useFormInstance();
  const situacao = formInstance.getFieldsValue(true).situacao;

  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);
  const aprovarSelecionado =
    tipoJustificativa === 'Aprovar' || tipoJustificativa === 'Sugerir aprovação';
  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

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
        carregarDados();
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

  const montarJustificativaInicial = () => {
    return (
      <ModalAprovarRecusarConteudoInicial
        propostaId={propostaId}
        onClickSalvar={validateFields}
        aprovarSelecionado={aprovarSelecionado}
        situacao={situacao}
      />
    );
  };

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
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        {montarJustificativaInicial()}
      </Form>
    </Modal>
  );
};
