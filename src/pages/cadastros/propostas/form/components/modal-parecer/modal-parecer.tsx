import { Empty, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import Auditoria from '~/components/main/text/auditoria';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  PropostaParecerCadastroDTO,
  PropostaParecerCompletoDTO,
  PropostaParecerFiltroDTO,
} from '~/core/dto/parecer-proposta-dto';
import { CamposParecerEnum, CamposParecerEnumDisplay } from '~/core/enum/campos-proposta-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';
import {
  obterParecer,
  obterPropostaPorId,
  removerParecer,
  salvarParecer,
} from '~/core/services/proposta-service';
import { PropostaContext } from '../../provider';
import { ModalParecerConteudo } from './modal-parecer-conteudo';
import { ModalParecerConteudoInicial } from './modal-parecer-conteudo-inicial';

type ModalParecerProps = {
  propostaId?: number;
  campo: CamposParecerEnum;
  onFecharButton: () => void;
};

export const ModalParecer: React.FC<ModalParecerProps> = ({
  campo,
  propostaId,
  onFecharButton,
}) => {
  const [form] = useForm();
  const { setFormInitialValues } = useContext(PropostaContext);
  const [dados, setDados] = useState<PropostaParecerCompletoDTO>();
  const [perfilAreaPromotora, setPerfilAreaPromotora] = useState<boolean>(false);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);

  const podeInserir = dados?.podeInserir;
  const temParecer = !!dados?.itens.length;
  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

  const carregarParecer = async () => {
    if (!propostaId && !campo) return;

    const params: PropostaParecerFiltroDTO = {
      propostaId,
      campo,
    };

    const resposta = await obterParecer(params);

    if (resposta.sucesso) {
      const dados = resposta.dados;
      setDados({ ...dados });
    }
  };

  const carregarAreaPromotora = () => {
    obterAreaPromotoraLista().then((resposta) => {
      if (resposta.sucesso) {
        const ehPerfilAreaPromotora = resposta.dados.find(
          (perfil) => perfil.descricao === perfilSelecionado?.perfilNome,
        );
        setPerfilAreaPromotora(!!ehPerfilAreaPromotora);
      }
    });
  };

  const atualizarProposta = async () => {
    if (!propostaId) return;
    const resposta = await obterPropostaPorId(propostaId);
    if (resposta.sucesso) {
      const podeEnviarParecer = !!resposta.dados.podeEnviarConsideracoes;
      const podeEnviar = !!resposta.dados.podeEnviar;
      const situacao = resposta.dados.situacao;
      const totalDePareceres = resposta.dados.totalDeConsideracoes;

      setFormInitialValues((valoresAtuais) => ({
        ...valoresAtuais,
        podeEnviarParecer,
        podeEnviar,
        situacao,
        totalDePareceres,
      }));
    }
  };

  const salvar = () => {
    if (!propostaId) return;

    const valoresSalvar = form.getFieldsValue(true);

    const params: PropostaParecerCadastroDTO = {
      campo,
      propostaId,
      id: null,
      descricao: valoresSalvar?.descricao || '',
    };

    salvarParecer(params).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: resposta.dados.mensagem,
        });

        carregarParecer();
        atualizarProposta();
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
        content: 'Você não salvou o parecer, deseja descartar a alteração?',
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

  const onClickExcluir = (parecerId: number | undefined) => {
    if (!parecerId) return;

    confirmacao({
      content: 'Tem certeza que deseja excluir o parecer?',
      onOk() {
        removerParecer(parecerId).then((resposta) => {
          if (resposta.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: 'Parecer excluído com sucesso!',
            });
            carregarParecer();
            atualizarProposta();
            form.setFieldValue('descricao', '');
          }
        });
      },
    });
  };

  useEffect(() => {
    carregarParecer();
    carregarAreaPromotora();
  }, []);

  const montarParecerEdicao = () => {
    if (temParecer)
      return (
        <>
          {dados?.itens?.map((parecer, index) => {
            return (
              <React.Fragment key={parecer.id}>
                <ModalParecerConteudo
                  index={index}
                  parecer={parecer}
                  propostaId={propostaId}
                  onClickExcluir={onClickExcluir}
                  carregarParecer={carregarParecer}
                />
                <Auditoria dados={parecer?.auditoria} />
              </React.Fragment>
            );
          })}
        </>
      );

    return (
      <Empty style={{ margin: 26 }} description='Nenhum parecer foi registrado para este campo' />
    );
  };

  const montarParecerInicial = () => {
    if (perfilAreaPromotora || ehPerfilAdminDf || !podeInserir) return <></>;

    return <ModalParecerConteudoInicial onClickSalvar={validateFields} />;
  };

  return (
    <Modal
      open
      centered
      destroyOnClose
      closable={false}
      onCancel={fecharModal}
      cancelText='Fechar'
      okButtonProps={{
        hidden: true,
      }}
      title={`Parecer - ${CamposParecerEnumDisplay[campo]}`}
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        {montarParecerInicial()}
        {montarParecerEdicao()}
      </Form>

      {!!dados?.auditoria?.id ? <Auditoria dados={dados?.auditoria} /> : <></>}
    </Modal>
  );
};
