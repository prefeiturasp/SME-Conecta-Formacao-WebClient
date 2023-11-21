import { Badge, Button, Col, Divider, Form, Row, StepProps, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import CardInformacoesCadastrante from '~/components/lib/object-card/dados-cadastrante';
import ButtonVoltar from '~/components/main/button/voltar';
import Steps from '~/components/main/steps';
import Auditoria from '~/components/main/text/auditoria';
import {
  CF_BUTTON_CADASTRAR_PROPOSTA,
  CF_BUTTON_CANCELAR,
  CF_BUTTON_ENVIAR_PROPOSTA,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_PROXIMO_STEP,
  CF_BUTTON_SALVAR_RASCUNHO,
  CF_BUTTON_STEP_ANTERIOR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  APOS_ENVIAR_PROPOSTA_NAO_EDITA,
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_ENVIAR_PROPOSTA,
  DESEJA_EXCLUIR_REGISTRO,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  DESEJA_SALVAR_PROPOSTA_ANTES_DE_ENVIAR,
  NAO_ENVIOU_PROPOSTA_ANALISE,
  PROPOSTA_CADASTRADA,
  PROPOSTA_ENVIADA,
  REGISTRO_EXCLUIDO_SUCESSO,
} from '~/core/constants/mensagens';
import { STEP_PROPOSTA, StepPropostaEnum } from '~/core/constants/steps-proposta';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaDTO, PropostaFormDTO } from '~/core/dto/proposta-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoRegistro, SituacaoRegistroTagDisplay } from '~/core/enum/situacao-registro';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { TipoInscricao } from '~/core/enum/tipo-inscricao';
import { confirmacao } from '~/core/services/alerta-service';
import {
  alterarProposta,
  deletarProposta,
  enviarPropostaDF,
  inserirProposta,
  obterPropostaPorId,
} from '~/core/services/proposta-service';
import FormularioCertificacao from './steps/formulario-certificacao';
import FormularioDatas from './steps/formulario-datas';
import FormularioDetalhamento from './steps/formulario-detalhamento/formulario-detalhamento';
import FormularioProfissionais from './steps/formulario-profissionais';
import FormInformacoesGerais from './steps/informacoes-gerais';
import ModalErroProposta from '~/components/lib/modal-erros-proposta';

const FormCadastroDePropostas: React.FC = () => {
  const [form] = useForm();
  const [openModalErros, setOpenModalErros] = useState(false);
  const [listaErros, setListaErros] = useState<string[]>([]);

  const showModalErros = () => setOpenModalErros(true);
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const [currentStep, setCurrentStep] = useState<StepPropostaEnum>(
    StepPropostaEnum.InformacoesGerais,
  );
  const [formInitialValues, setFormInitialValues] = useState<PropostaFormDTO>();

  const id = paramsRoute?.id || 0;

  const desabilitarTodosFormularios =
    SituacaoRegistro.AguardandoAnaliseDF === formInitialValues?.situacao;

  const stepsProposta: StepProps[] = [
    {
      title: STEP_PROPOSTA.INFORMACOES_GERAIS.TITULO,
    },
    {
      title: STEP_PROPOSTA.DETALHAMENTO.TITULO,
    },
    {
      title: STEP_PROPOSTA.DATAS.TITULO,
    },
    {
      title: STEP_PROPOSTA.PROFISSIONAIS.TITULO,
    },
    {
      title: STEP_PROPOSTA.CERTIFICACAO.TITULO,
    },
  ];

  const carregarValoresDefault = () => {
    const valoresIniciais: PropostaFormDTO = {
      tipoFormacao: TipoFormacao.Curso,
      tipoInscricao: TipoInscricao.Optativa,
      publicosAlvo: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      criterioCertificacao: [],
      cursoComCertificado: false,
      acaoInformativa: false,
      situacao: SituacaoRegistro.Rascunho,
    };

    setFormInitialValues(valoresIniciais);
  };

  const carregarDados = useCallback(async () => {
    const resposta = await obterPropostaPorId(id);
    const dados = resposta.dados;

    if (resposta.sucesso) {
      let publicosAlvo: number[] = [];
      if (dados?.publicosAlvo?.length) {
        publicosAlvo = dados.publicosAlvo.map((item) => item.cargoFuncaoId);
      }

      let funcoesEspecificas: number[] = [];
      if (dados?.funcoesEspecificas?.length) {
        funcoesEspecificas = dados.funcoesEspecificas.map((item) => item.cargoFuncaoId);
      }

      let vagasRemanecentes: number[] = [];
      if (dados?.vagasRemanecentes?.length) {
        vagasRemanecentes = dados.vagasRemanecentes.map((item) => item.cargoFuncaoId);
      }

      let palavrasChaves: number[] = [];
      if (dados?.palavrasChaves?.length) {
        palavrasChaves = dados.palavrasChaves.map((item) => item.palavraChaveId);
      }

      let criterioCertificacao: number[] = [];
      if (dados?.criterioCertificacao?.length) {
        criterioCertificacao = dados.criterioCertificacao.map(
          (item) => item.criterioCertificacaoId,
        );
      }

      let criteriosValidacaoInscricao: number[] = [];
      if (dados?.criteriosValidacaoInscricao?.length) {
        criteriosValidacaoInscricao = dados.criteriosValidacaoInscricao.map(
          (item) => item.criterioValidacaoInscricaoId,
        );
      }

      const arquivoImagemDivulgacao = dados?.arquivoImagemDivulgacao;
      let arquivos: any[] = [];
      if (arquivoImagemDivulgacao?.arquivoId) {
        arquivos = [
          {
            xhr: arquivoImagemDivulgacao?.codigo,
            name: arquivoImagemDivulgacao?.nome,
            id: arquivoImagemDivulgacao?.arquivoId,
            status: 'done',
          },
        ];
      }

      let periodoRealizacao: Dayjs[] = [];
      const dataRealizacaoInicio = dados?.dataRealizacaoInicio;
      const dataRealizacaoFim = dados?.dataRealizacaoFim;
      if (dataRealizacaoInicio && dataRealizacaoFim) {
        periodoRealizacao = [dayjs(dataRealizacaoInicio), dayjs(dataRealizacaoFim)];
      }

      let periodoInscricao: Dayjs[] = [];
      const dataInscricaoInicio = dados?.dataInscricaoInicio;
      const dataInscricaoFim = dados?.dataInscricaoFim;
      if (dataInscricaoInicio && dataInscricaoFim) {
        periodoInscricao = [dayjs(dataInscricaoInicio), dayjs(dataInscricaoFim)];
      }

      const valoresIniciais: PropostaFormDTO = {
        ...dados,
        publicosAlvo,
        funcoesEspecificas,
        vagasRemanecentes,
        criteriosValidacaoInscricao,
        arquivos,
        periodoRealizacao,
        periodoInscricao,
        palavrasChaves,
        criterioCertificacao,
      };

      setFormInitialValues(valoresIniciais);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    } else {
      carregarValoresDefault();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  const onClickCancelar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_CANCELAR_ALTERACOES,
        onOk() {
          form.resetFields();
        },
      });
    }
  };

  const salvar = async (novaSituacao?: SituacaoRegistro) => {
    let response = null;
    const values: PropostaFormDTO = form.getFieldsValue(true);
    const clonedValues = cloneDeep(values);

    const dataRealizacaoInicio = values?.periodoRealizacao?.[0];
    const dataRealizacaoFim = values.periodoRealizacao?.[1];

    const dataInscricaoInicio = values?.periodoInscricao?.[0];
    const dataInscricaoFim = values.periodoInscricao?.[1];

    let situacao = SituacaoRegistro.Rascunho;

    if (id && !novaSituacao && !clonedValues?.situacao) {
      situacao;
    }

    if (id && !novaSituacao && clonedValues?.situacao) {
      situacao = clonedValues?.situacao;
    }

    if (id && novaSituacao) {
      situacao = novaSituacao;
    }

    const valoresSalvar: PropostaDTO = {
      tipoFormacao: clonedValues?.tipoFormacao,
      modalidade: clonedValues?.modalidade,
      tipoInscricao: clonedValues?.tipoInscricao,
      nomeFormacao: clonedValues?.nomeFormacao,
      quantidadeTurmas: clonedValues?.quantidadeTurmas,
      quantidadeVagasTurma: clonedValues?.quantidadeVagasTurma,
      publicosAlvo: [],
      funcoesEspecificas: [],
      funcaoEspecificaOutros: clonedValues?.funcaoEspecificaOutros || '',
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      criterioValidacaoInscricaoOutros: clonedValues?.criterioValidacaoInscricaoOutros || '',
      situacao,
      dataRealizacaoInicio,
      dataRealizacaoFim,
      dataInscricaoInicio,
      dataInscricaoFim,
      cargaHorariaPresencial: clonedValues.cargaHorariaPresencial,
      cargaHorariaSincrona: clonedValues.cargaHorariaSincrona,
      cargaHorariaDistancia: clonedValues.cargaHorariaDistancia,
      justificativa: clonedValues.justificativa,
      referencia: clonedValues.referencia,
      procedimentoMetadologico: clonedValues.procedimentoMetadologico,
      conteudoProgramatico: clonedValues.conteudoProgramatico,
      objetivos: clonedValues.objetivos,
      palavrasChaves: [],
      criterioCertificacao: [],
      cursoComCertificado: clonedValues.cursoComCertificado,
      acaoInformativa: clonedValues.acaoInformativa,
      acaoFormativaTexto: clonedValues?.acaoFormativaTexto || '',
      acaoFormativaLink: clonedValues?.acaoFormativaLink || '',
      descricaoDaAtividade: clonedValues.descricaoDaAtividade,
    };

    if (clonedValues?.publicosAlvo?.length) {
      valoresSalvar.publicosAlvo = clonedValues.publicosAlvo.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }
    if (clonedValues?.palavrasChaves?.length) {
      valoresSalvar.palavrasChaves = clonedValues.palavrasChaves.map((palavraChaveId) => ({
        palavraChaveId,
      }));
    }
    if (clonedValues?.criterioCertificacao?.length) {
      valoresSalvar.criterioCertificacao = clonedValues.criterioCertificacao.map(
        (criterioCertificacaoId) => ({
          criterioCertificacaoId,
        }),
      );
    }
    if (clonedValues?.funcoesEspecificas?.length) {
      valoresSalvar.funcoesEspecificas = clonedValues.funcoesEspecificas.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }
    if (clonedValues?.vagasRemanecentes?.length) {
      valoresSalvar.vagasRemanecentes = clonedValues.vagasRemanecentes.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }
    if (clonedValues?.criteriosValidacaoInscricao?.length) {
      valoresSalvar.criteriosValidacaoInscricao = clonedValues.criteriosValidacaoInscricao.map(
        (criterioValidacaoInscricaoId) => ({
          criterioValidacaoInscricaoId,
        }),
      );
    }
    if (clonedValues?.arquivos?.length) {
      valoresSalvar.arquivoImagemDivulgacaoId = clonedValues.arquivos?.[0]?.id;
    }

    if (id) {
      response = await alterarProposta(id, valoresSalvar);
    } else {
      response = await inserirProposta(valoresSalvar);
    }
    if (response.sucesso) {
      if (situacao && situacao !== SituacaoRegistro.Rascunho) {
        notification.success({
          message: 'Sucesso',
          description: PROPOSTA_CADASTRADA,
        });
      } else {
        notification.success({
          message: 'Sucesso',
          description: `Proposta ${id ? 'alterada' : 'inserida'} com sucesso!`,
        });
      }

      if (id) {
        carregarDados();
      } else {
        const novoId = response.dados;
        navigate(`${ROUTES.CADASTRO_DE_PROPOSTAS}/editar/${novoId}`, { replace: true });
      }
    }
    if (response.mensagens.length) {
      setListaErros(response.mensagens);
      showModalErros();
    }
    return response;
  };

  const proximoPasso = async () => {
    if (form.isFieldsTouched()) {
      await salvar();
    }

    setCurrentStep(currentStep + 1);
  };

  const passoAnterior = async () => {
    currentStep >= StepPropostaEnum.Detalhamento && setCurrentStep(currentStep - 1);
  };

  const onClickExcluir = () => {
    if (id) {
      confirmacao({
        content: DESEJA_EXCLUIR_REGISTRO,
        async onOk() {
          deletarProposta(id).then((response) => {
            if (response?.sucesso) {
              notification.success({
                message: 'Sucesso',
                description: REGISTRO_EXCLUIDO_SUCESSO,
              });
              navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
            }
          });
        },
      });
    }
  };

  const onClickVoltar = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        async onOk() {
          await salvar().then((response) => {
            if (response?.sucesso) {
              navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
            }
          });
        },
        onCancel() {
          navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
        },
      });
    } else {
      navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
    }
  };

  const selecionarTelaStep = (stepSelecionado: StepPropostaEnum) => {
    return (
      <>
        <Form.Item hidden={StepPropostaEnum.InformacoesGerais !== stepSelecionado}>
          <FormInformacoesGerais form={form} />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Detalhamento !== stepSelecionado}>
          <FormularioDetalhamento disabledForm={desabilitarTodosFormularios} />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Datas !== stepSelecionado}>
          <FormularioDatas form={form} />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Profissionais !== stepSelecionado}>
          <FormularioProfissionais />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Certificacao !== stepSelecionado}>
          <FormularioCertificacao form={form} disabledForm={desabilitarTodosFormularios} />
        </Form.Item>
      </>
    );
  };

  const salvarProposta = () => {
    form
      .validateFields()
      .then(() => {
        salvar(SituacaoRegistro.Cadastrada)
          .then((response) => {
            if (response.sucesso) {
              confirmacao({
                content: DESEJA_ENVIAR_PROPOSTA,
                onOk() {
                  enviarProposta();
                },

                onCancel() {
                  carregarDados();
                },
              });
            }
          })
          .catch((erro) => {
            if (erro) {
              notification.error({
                message: 'Erro',
                description: erro,
              });
            }
          });
      })
      .catch((error: any) => {
        if (error?.errorFields?.length) {
          setListaErros(error.errorFields.map((h: { errors: Array<string> }) => h.errors));
          showModalErros();
        }
      });
  };

  const enviarProposta = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_PROPOSTA_ANTES_DE_ENVIAR,
        onOk() {
          salvar();
        },

        onCancel() {
          carregarDados();
        },
      });
    } else {
      confirmacao({
        content: APOS_ENVIAR_PROPOSTA_NAO_EDITA,
        onOk() {
          enviarPropostaDF(id)
            .then(() => {
              notification.success({
                message: 'Sucesso',
                description: PROPOSTA_ENVIADA,
              });

              navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
            })
            .catch((erro) => {
              if (erro) {
                notification.error({
                  message: 'Erro',
                  description: erro,
                });
              }
            });
        },
      });
    }
  };

  const badgeSituacaoProposta = () => {
    switch (formInitialValues?.situacao) {
      case SituacaoRegistro.Ativo:
        return SituacaoRegistroTagDisplay[SituacaoRegistro.Ativo];
      case SituacaoRegistro.Rascunho:
        return SituacaoRegistroTagDisplay[SituacaoRegistro.Rascunho];
      case SituacaoRegistro.Cadastrada:
        return SituacaoRegistroTagDisplay[SituacaoRegistro.Cadastrada];
      case SituacaoRegistro.AguardandoAnaliseDF:
        return SituacaoRegistroTagDisplay[SituacaoRegistro.AguardandoAnaliseDF];
    }
  };

  return (
    <Col>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={formInitialValues}
        validateMessages={validateMessages}
        disabled={desabilitarTodosFormularios}
      >
        <HeaderPage title='Cadastro de Propostas'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
                  disabled={false}
                  onClick={() => {
                    if (SituacaoRegistro.Cadastrada === formInitialValues?.situacao) {
                      confirmacao({
                        content: NAO_ENVIOU_PROPOSTA_ANALISE,
                        onOk() {
                          onClickVoltar();
                        },
                      });
                    } else {
                      onClickVoltar();
                    }
                  }}
                  id={CF_BUTTON_VOLTAR}
                />
              </Col>
              {id ? (
                <Col>
                  <ButtonExcluir id={CF_BUTTON_EXCLUIR} onClick={onClickExcluir} />
                </Col>
              ) : (
                <></>
              )}
              <Col>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {() => (
                    <Button
                      block
                      type='default'
                      id={CF_BUTTON_CANCELAR}
                      onClick={onClickCancelar}
                      style={{ fontWeight: 700 }}
                      disabled={!form.isFieldsTouched()}
                    >
                      Cancelar
                    </Button>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Button
                  block
                  onClick={passoAnterior}
                  id={CF_BUTTON_STEP_ANTERIOR}
                  style={{ fontWeight: 700 }}
                  disabled={currentStep < StepPropostaEnum.Detalhamento}
                >
                  Passo anterior
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  onClick={proximoPasso}
                  id={CF_BUTTON_PROXIMO_STEP}
                  style={{ fontWeight: 700 }}
                  disabled={
                    (!form.isFieldsTouched() && !(parseInt(id.toString()) > 0)) ||
                    currentStep >= StepPropostaEnum.Certificacao
                  }
                >
                  Próximo passo
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  type='primary'
                  id={CF_BUTTON_SALVAR_RASCUNHO}
                  onClick={() => salvar()}
                  style={{ fontWeight: 700 }}
                >
                  Salvar rascunho
                </Button>
              </Col>
              {currentStep === StepPropostaEnum.Certificacao && (
                <Col>
                  <Button
                    block
                    type='primary'
                    id={CF_BUTTON_CADASTRAR_PROPOSTA}
                    onClick={salvarProposta}
                    style={{ fontWeight: 700 }}
                  >
                    Salvar
                  </Button>
                </Col>
              )}
              {formInitialValues?.situacao === SituacaoRegistro.Cadastrada &&
                currentStep === StepPropostaEnum.Certificacao && (
                  <Col>
                    <Button
                      block
                      type='primary'
                      onClick={enviarProposta}
                      style={{ fontWeight: 700 }}
                      id={CF_BUTTON_ENVIAR_PROPOSTA}
                    >
                      Enviar
                    </Button>
                  </Col>
                )}
            </Row>
          </Col>
        </HeaderPage>
        <br />
        <CardInformacoesCadastrante />
        <br />
        <Badge.Ribbon text={badgeSituacaoProposta()}>
          <CardContent>
            <Divider orientation='left' />
            <Steps current={currentStep} items={stepsProposta} style={{ marginBottom: 55 }} />
            {selecionarTelaStep(currentStep)}
            <Auditoria dados={formInitialValues?.auditoria} />
          </CardContent>
        </Badge.Ribbon>
      </Form>
      {openModalErros && (
        <ModalErroProposta closeModal={() => setOpenModalErros(false)} erros={listaErros} />
      )}
    </Col>
  );
};

export default FormCadastroDePropostas;
