import { App, Badge, Button, Col, Divider, Form, Row, StepProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import jwt_decode from 'jwt-decode';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import ModalErroProposta from '~/components/lib/modal-erros-proposta';
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
  PROPOSTA_ENVIADA,
  REGISTRO_EXCLUIDO_SUCESSO,
} from '~/core/constants/mensagens';
import { STEP_PROPOSTA, StepPropostaEnum } from '~/core/constants/steps-proposta';
import { validateMessages } from '~/core/constants/validate-messages';
import { Dayjs, dayjs } from '~/core/date/dayjs';
import { JWTDecodeDTO } from '~/core/dto/jwt-decode-dto';
import {
  PropostaDTO,
  PropostaFormDTO,
  PropostaTurmaDTO,
  PropostaTurmaFormDTO,
} from '~/core/dto/proposta-dto';
import { DreDTO } from '~/core/dto/retorno-listagem-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoRegistro, SituacaoRegistroTagDisplay } from '~/core/enum/situacao-registro';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { TipoInscricao } from '~/core/enum/tipo-inscricao';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { obterDREs } from '~/core/services/dre-service';
import {
  alterarProposta,
  deletarProposta,
  enviarPropostaAnalise,
  inserirProposta,
  obterPropostaPorId,
} from '~/core/services/proposta-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import FormInformacoesGerais from './steps//formulario-informacoes-gerais/informacoes-gerais';
import FormularioCertificacao from './steps/formulario-certificacao';
import FormularioDatas from './steps/formulario-datas';
import FormularioDetalhamento from './steps/formulario-detalhamento/formulario-detalhamento';
import FormularioProfissionais from './steps/formulario-profissionais';

const FormCadastroDePropostas: React.FC = () => {
  const [form] = useForm();

  const { notification } = App.useApp();
  const { desabilitarCampos, setDesabilitarCampos } = useContext(PermissaoContext);

  const [openModalErros, setOpenModalErros] = useState(false);
  const [listaErros, setListaErros] = useState<string[]>([]);

  const [listaDres, setListaDres] = useState<any[]>([]);

  const token = useAppSelector((store) => store.auth.token);
  const decodeObject: JWTDecodeDTO = jwt_decode(token);
  const dresVinculadaDoToken = decodeObject?.dres;

  const temDreVinculada =
    typeof dresVinculadaDoToken === 'string' ||
    (Array.isArray(dresVinculadaDoToken) && dresVinculadaDoToken.length > 0);

  const obterDREVinculada = async (listaDres: DreDTO[]) => {
    if (listaDres?.length) {
      return listaDres.filter((item: any) => item.codigo === dresVinculadaDoToken);
    }

    return [];
  };

  const permissao = obterPermissaoPorMenu(MenuEnum.CadastroProposta);

  const showModalErros = () => setOpenModalErros(true);
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const [currentStep, setCurrentStep] = useState<StepPropostaEnum>(
    StepPropostaEnum.InformacoesGerais,
  );

  const [formInitialValues, setFormInitialValues] = useState<PropostaFormDTO>();

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const exibirBotaoRascunho =
    !formInitialValues?.situacao || formInitialValues?.situacao === SituacaoRegistro.Rascunho;

  const exibirBotaoSalvar = currentStep === StepPropostaEnum.Certificacao;

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

  useEffect(() => {
    if (formInitialValues?.situacao) {
      const desabilitarTodosFormularios =
        desabilitarCampos ||
        (formInitialValues?.situacao !== SituacaoRegistro.Rascunho &&
          formInitialValues?.situacao !== SituacaoRegistro.Cadastrada);

      setDesabilitarCampos(desabilitarTodosFormularios);
    }
  }, [formInitialValues, desabilitarCampos]);

  const carregarValoresDefault = async () => {
    const retornolistaDres = await obterDREs(true);

    const listaDres = retornolistaDres.dados.map((dre) => ({
      ...dre,
      value: dre.id,
      label: dre.descricao,
    }));

    const dresVinculadas = await obterDREVinculada(listaDres);

    const valoresIniciais: PropostaFormDTO = {
      tipoFormacao: TipoFormacao.Curso,
      tipoInscricao: TipoInscricao.Optativa,
      publicosAlvo: [],
      dres: temDreVinculada ? dresVinculadas : [],
      modalidade: undefined,
      componentesCurriculares: [],
      anosTurmas: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      criterioCertificacao: [],
      cursoComCertificado: false,
      acaoInformativa: false,
      nomeSituacao: SituacaoRegistroTagDisplay[SituacaoRegistro.Rascunho],
    };

    setListaDres(listaDres);

    setFormInitialValues(valoresIniciais);
  };

  const carregarDados = useCallback(async () => {
    const resposta = await obterPropostaPorId(id);
    const dados = resposta.dados;

    if (resposta.sucesso) {
      const retornolistaDres = await obterDREs(true);

      const listaDres = retornolistaDres.dados.map((dre) => ({
        ...dre,
        value: dre.id,
        label: dre.descricao,
      }));

      let dres: PropostaFormDTO['dres'] = [];
      if (dados?.dres?.length) {
        const originData = dados.dres.map((item) => item.dreId);
        const newData = cloneDeep(listaDres).filter((item) => originData.includes(item.id));
        dres = newData;
      }

      let modalidade: number | undefined = undefined;
      if (dados?.modalidades?.length) {
        modalidade = dados.modalidades[0]?.modalidade;
      }

      let anosTurmas: number[] = [];
      if (dados?.anosTurmas?.length) {
        anosTurmas = dados.anosTurmas.map((item) => item.anoTurmaId);
      }

      let componentesCurriculares: number[] = [];
      if (dados?.componentesCurriculares?.length) {
        componentesCurriculares = dados.componentesCurriculares.map(
          (item) => item.componenteCurricularId,
        );
      }

      let turmas: PropostaTurmaFormDTO[] = [];
      if (dados?.turmas?.length) {
        turmas = dados.turmas.map((turma: any, index): PropostaTurmaFormDTO => {
          let newDres: DreDTO[] = [];

          if (turma?.dres?.length) {
            const originData = turma.dres.map((dre: any) => dre?.dreId);
            newDres = cloneDeep(listaDres).filter((item) => originData.includes(item.id));
          }

          return {
            ...turma,
            dres: newDres,
            key: index,
          };
        });
      }

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
        periodoRealizacao = [dayjs.tz(dataRealizacaoInicio), dayjs.tz(dataRealizacaoFim)];
      }

      let periodoInscricao: Dayjs[] = [];
      const dataInscricaoInicio = dados?.dataInscricaoInicio;
      const dataInscricaoFim = dados?.dataInscricaoFim;
      if (dataInscricaoInicio && dataInscricaoFim) {
        periodoInscricao = [dayjs.tz(dataInscricaoInicio), dayjs.tz(dataInscricaoFim)];
      }

      const valoresIniciais: PropostaFormDTO = {
        ...dados,
        publicosAlvo,
        dres,
        modalidade,
        componentesCurriculares,
        anosTurmas,
        turmas,
        funcoesEspecificas,
        vagasRemanecentes,
        criteriosValidacaoInscricao,
        arquivos,
        periodoRealizacao,
        periodoInscricao,
        palavrasChaves,
        criterioCertificacao,
      };

      setListaDres(listaDres);
      setFormInitialValues({ ...valoresIniciais });
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
    const clonedValues: PropostaFormDTO = cloneDeep(values);

    const dataRealizacaoInicio = values?.periodoRealizacao?.[0]
      ? values?.periodoRealizacao?.[0].format('YYYY-MM-DD')
      : undefined;

    const dataRealizacaoFim = values?.periodoRealizacao?.[1]
      ? values?.periodoRealizacao?.[1].format('YYYY-MM-DD')
      : undefined;

    const dataInscricaoInicio = values?.periodoInscricao?.[0]
      ? values?.periodoInscricao?.[0].format('YYYY-MM-DD')
      : undefined;

    const dataInscricaoFim = values?.periodoInscricao?.[1]
      ? values?.periodoInscricao?.[1].format('YYYY-MM-DD')
      : undefined;

    let situacao = SituacaoRegistro.Rascunho;

    if (id && !novaSituacao && formInitialValues?.situacao) {
      situacao = formInitialValues?.situacao;
    } else if (novaSituacao) {
      situacao = novaSituacao;
    }

    const valoresSalvar: PropostaDTO = {
      formacaoHomologada: clonedValues?.formacaoHomologada,
      tipoFormacao: clonedValues?.tipoFormacao,
      formato: clonedValues?.formato,
      tipoInscricao: clonedValues?.tipoInscricao,
      dreIdPropostas: clonedValues?.dreIdPropostas || null,
      nomeFormacao: clonedValues?.nomeFormacao,
      quantidadeTurmas: clonedValues?.quantidadeTurmas || null,
      quantidadeVagasTurma: clonedValues?.quantidadeVagasTurma || null,
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
      dres: [],
      turmas: [],
      modalidades: [],
      anosTurmas: [],
      componentesCurriculares: [],
    };

    if (clonedValues?.dres?.length) {
      valoresSalvar.dres = clonedValues.dres.map((dre) => ({ dreId: dre?.value }));
    }

    if (clonedValues?.modalidade) {
      valoresSalvar.modalidades = [{ modalidade: clonedValues.modalidade }];
    }

    if (clonedValues?.anosTurmas?.length) {
      valoresSalvar.anosTurmas = clonedValues.anosTurmas.map((anoTurmaId) => ({
        anoTurmaId,
      }));
    }

    if (clonedValues?.componentesCurriculares?.length) {
      valoresSalvar.componentesCurriculares = clonedValues.componentesCurriculares.map(
        (componenteCurricularId) => ({
          componenteCurricularId,
        }),
      );
    }

    if (clonedValues?.turmas?.length) {
      valoresSalvar.turmas = clonedValues.turmas.map((item) => {
        const turma: PropostaTurmaDTO = {
          nome: item.nome,
        };
        if (item.dres?.length) {
          turma.dresIds = item.dres.map((dre) => dre.value);
        } else {
          turma.dresIds = [];
        }

        if (item.id) {
          turma.id = item.id;
        }
        return turma;
      });
    }

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
      response = await alterarProposta(id, valoresSalvar, false);
    } else {
      response = await inserirProposta(valoresSalvar);
    }

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: `Proposta ${id ? 'alterada' : 'inserida'} com sucesso!`,
      });

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
          <FormInformacoesGerais listaDres={listaDres} />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Detalhamento !== stepSelecionado}>
          <FormularioDetalhamento />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Datas !== stepSelecionado}>
          <FormularioDatas />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Profissionais !== stepSelecionado}>
          <FormularioProfissionais />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Certificacao !== stepSelecionado}>
          <FormularioCertificacao />
        </Form.Item>
      </>
    );
  };

  const salvarProposta = (confirmarAntesDeEnviarProposta: boolean) => {
    form
      .validateFields()
      .then(() => {
        const situacao =
          formInitialValues?.situacao === SituacaoRegistro.Rascunho
            ? SituacaoRegistro.Cadastrada
            : formInitialValues?.situacao;

        salvar(situacao).then((response) => {
          if (response.sucesso) {
            if (confirmarAntesDeEnviarProposta) {
              confirmacao({
                content: DESEJA_ENVIAR_PROPOSTA,
                onOk() {
                  enviarProposta();
                },

                onCancel() {
                  carregarDados();
                },
              });
            } else {
              enviarProposta();
            }
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
    confirmacao({
      content: APOS_ENVIAR_PROPOSTA_NAO_EDITA,
      onOk() {
        enviarPropostaAnalise(id).then((response) => {
          if (response.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: PROPOSTA_ENVIADA,
            });
            navigate(ROUTES.CADASTRO_DE_PROPOSTAS);
          }
          if (response.mensagens.length) {
            setListaErros(response.mensagens);
            showModalErros();
          }
        });
      },
    });
  };

  const validarAntesEnviarProposta = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_PROPOSTA_ANTES_DE_ENVIAR,
        onOk() {
          salvarProposta(false);
        },
        onCancel() {
          enviarProposta();
        },
      });
    } else {
      enviarProposta();
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
        disabled={desabilitarCampos}
      >
        <HeaderPage title='Cadastro de Propostas'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <ButtonVoltar
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
                  <ButtonExcluir
                    id={CF_BUTTON_EXCLUIR}
                    onClick={onClickExcluir}
                    disabled={!permissao.podeExcluir}
                  />
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
              {exibirBotaoRascunho && (
                <Col>
                  <Button
                    block
                    type='primary'
                    id={CF_BUTTON_SALVAR_RASCUNHO}
                    onClick={() => salvar()}
                    disabled={desabilitarCampos}
                    style={{ fontWeight: 700 }}
                  >
                    Salvar rascunho
                  </Button>
                </Col>
              )}
              {exibirBotaoSalvar && (
                <Col>
                  <Button
                    block
                    type='primary'
                    id={CF_BUTTON_CADASTRAR_PROPOSTA}
                    disabled={desabilitarCampos}
                    onClick={() => {
                      salvarProposta(true);
                    }}
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
                      onClick={validarAntesEnviarProposta}
                      style={{ fontWeight: 700 }}
                      disabled={desabilitarCampos}
                      id={CF_BUTTON_ENVIAR_PROPOSTA}
                    >
                      Enviar
                    </Button>
                  </Col>
                )}
            </Row>
          </Col>
        </HeaderPage>

        <CardInformacoesCadastrante />

        <Badge.Ribbon text={formInitialValues?.nomeSituacao}>
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
