import { Button, Form, Input, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect, useState } from 'react';
import { ButtonEdit } from '~/components/lib/button/edit';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import Auditoria from '~/components/main/text/auditoria';
import { CF_INPUT_TEXT_AREA } from '~/core/constants/ids/input';
import { PARECER_NAO_INFORMADO } from '~/core/constants/mensagens';
import { validateMessages } from '~/core/constants/validate-messages';
import {
  PropostaParecerCadastroDTO,
  PropostaParecerCompletoDTO,
  PropostaParecerFiltroDTO,
} from '~/core/dto/parecer-proposta-dto';
import { CamposParecerEnum, CamposParecerEnumDisplay } from '~/core/enum/campos-proposta-enum';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { obterAreaPromotoraLista } from '~/core/services/area-promotora-service';
import {
  alterarParecer,
  obterParecer,
  removerParecer,
  salvarParecer,
} from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';
import { ButtonExcluirParecer } from './modal-parecer-button-excluir';

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

  const formInstance = useFormInstance();
  const [idCampo, setIdCampo] = useState<number>();
  const [edicao, setEdicao] = useState<boolean[]>([]);
  const [dados, setDados] = useState<PropostaParecerCompletoDTO>();
  const [perfilAreaPromotora, setPerfilAreaPromotora] = useState<boolean>(false);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);

  const nomeCampo = 'descricaoParecer';
  const situacaoProposta = formInstance.getFieldsValue(true).situacao;
  const situacaoAguardandoAnaliseParecerista =
    situacaoProposta === SituacaoProposta.AguardandoAnaliseParecerista;
  const situacaoAguardandoAnaliseDF = situacaoProposta === SituacaoProposta.AguardandoAnaliseDf;

  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];
  const ehPerfilParecerista =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista];
  const adminDFPodeEditar =
    ehPerfilAdminDf && (situacaoAguardandoAnaliseDF || situacaoAguardandoAnaliseParecerista);

  const carregarParecer = async () => {
    if (!propostaId && !campo) return;

    const params: PropostaParecerFiltroDTO = {
      propostaId,
      campo,
    };

    const resposta = await obterParecer(params);

    if (resposta.sucesso) {
      const dados = resposta.dados;
      setDados(dados);
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

  const salvarAlterar = () => {
    if (!propostaId) return;
    const valoresSalvar = form.getFieldsValue(true);

    let descricaoAlterada = '';

    if (idCampo && idCampo in valoresSalvar.descricaoParecer) {
      descricaoAlterada = valoresSalvar.descricaoParecer[idCampo];
    }

    const params: PropostaParecerCadastroDTO = {
      campo,
      propostaId,
      id: idCampo ? idCampo : null,
      descricao: edicao ? descricaoAlterada : valoresSalvar.descricaoParecer,
    };

    const endpoint = edicao ? alterarParecer : salvarParecer;

    endpoint(params).then((resposta) => {
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: resposta.dados.mensagem,
        });
        onFecharButton();
      }
    });
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      salvarAlterar();
    });
  };

  const cancelarAlteracoes = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: 'Você não salvou o parecer, deseja descartar a alteração?',
        onOk() {
          form.resetFields();
          setEdicao([]);
        },
        okText: 'Sim',
        cancelText: 'Não',
      });
    } else {
      form.resetFields();
      setEdicao([]);
    }
  };

  const excluirParecer = (parecerId: number | undefined) => {
    if (!parecerId) return;
    removerParecer(parecerId).then((resposta) => {
      if (resposta.sucesso) {
        confirmacao({
          content: 'Tem certeza que deseja excluir o parecer?',
          onOk() {
            notification.success({
              message: 'Sucesso',
              description: 'Parecer excluído com sucesso!',
            });
            carregarParecer();
          },
        });
      }
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

  const mostrarParecer = () => {
    return (
      <>
        {dados?.itens?.map((parecer, dadosIndex) => {
          const edicoes: boolean[] = Array(dados?.itens.length).fill(false);
          const initialValue = parecer.descricao;
          const habilitarTextArea = !edicao[dadosIndex];

          const handleOnChange = (position: number) => {
            const updatedCheckedState = edicoes.map((item, index) =>
              index === position ? !item : item,
            );

            setEdicao(updatedCheckedState);
          };

          return (
            <React.Fragment key={parecer.id}>
              <Form.Item
                initialValue={initialValue}
                name={[nomeCampo, `${parecer.id}`]}
                label={`Descrição do parecer (${dadosIndex + 1}):`}
                style={{ marginBottom: 6, marginTop: 16 }}
              >
                <Input.TextArea
                  rows={5}
                  id={`${CF_INPUT_TEXT_AREA}_${dadosIndex}`}
                  disabled={habilitarTextArea}
                  style={{
                    resize: 'none',
                    color: Colors.Neutral.DARK,
                    background: habilitarTextArea ? Colors.Neutral.LIGHTEST : 'none',
                    marginBottom: 6,
                  }}
                />
              </Form.Item>
              <Row justify='end'>
                <ButtonEdit
                  descricaoTooltip='Editar parecer'
                  onClickEditar={() => {
                    setIdCampo(parecer.id);
                    handleOnChange(dadosIndex);
                  }}
                  podeEditar={parecer.podeAlterar || adminDFPodeEditar}
                />
                <ButtonExcluirParecer
                  descricaoTooltip='Remover parecer'
                  onClickRemover={() => excluirParecer(parecer?.id)}
                  podeEditar={parecer.podeAlterar || adminDFPodeEditar}
                />
              </Row>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    carregarParecer();
    carregarAreaPromotora();
  }, []);

  return (
    <Modal
      open
      centered
      destroyOnClose
      okText='Salvar'
      closable={false}
      cancelText='Cancelar'
      onOk={validateFields}
      onCancel={cancelarAlteracoes}
      title={`Parecer - ${CamposParecerEnumDisplay[campo]}`}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Space>
          <Button type='text' style={{ color: Colors.Neutral.DARK }} onClick={fecharModal}>
            Fechar
          </Button>
          <CancelBtn />
          <OkBtn />
        </Space>
      )}
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        {perfilAreaPromotora || ehPerfilAdminDf ? (
          <></>
        ) : dados?.podeInserir ? (
          <Form.Item
            name={[nomeCampo]}
            label='Descrição do parecer:'
            rules={[{ required: true, message: PARECER_NAO_INFORMADO }]}
          >
            <Input.TextArea
              id={CF_INPUT_TEXT_AREA}
              rows={5}
              disabled={false}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        ) : (
          <></>
        )}

        {!!dados?.itens.length ? mostrarParecer() : <></>}
      </Form>

      {ehPerfilAdminDf || ehPerfilParecerista ? <Auditoria dados={dados?.auditoria} /> : <></>}
    </Modal>
  );
};
