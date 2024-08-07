import { Badge, Button, Col, Divider, Form, Row, StepProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import jwt_decode from 'jwt-decode';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import ButtonExcluir from '~/components/lib/excluir-button';
import HeaderPage from '~/components/lib/header-page';
import ModalErroProposta from '~/components/lib/modal-erros-proposta';
import { notification } from '~/components/lib/notification';
import CardInformacoesCadastrante from '~/components/lib/object-card/dados-cadastrante';
import ButtonVoltar from '~/components/main/button/voltar';
import { SelectPareceristas } from '~/components/main/input/parecerista';
import SelectResponsavelDf from '~/components/main/input/responsavel-df';
import Spin from '~/components/main/spin';
import Steps from '~/components/main/steps';
import Auditoria from '~/components/main/text/auditoria';
import AreaTexto from '~/components/main/text/text-area';
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
import { CF_INPUT_NUMERO_HOMOLOGACAO } from '~/core/constants/ids/input';
import {
  APOS_ENVIAR_PROPOSTA_ANALISE,
  APOS_ENVIAR_PROPOSTA_PUBLICAR,
  DESEJA_ENVIAR_PARECER,
  DESEJA_ENVIAR_PROPOSTA,
  DESEJA_ENVIAR_PROPOSTA_PRA_AREA_PROMOTORA,
  DESEJA_ENVIAR_PROPOSTA_PRO_PARECERISTA,
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
  PropostaPareceristaDTO,
  PropostaPareceristaFormDTO,
  PropostaTurmaDTO,
  PropostaTurmaFormDTO,
} from '~/core/dto/proposta-dto';
import { DreDTO } from '~/core/dto/retorno-listagem-dto';
import { AreaPromotoraTipoEnum } from '~/core/enum/area-promotora-tipo';
import { FormacaoHomologada } from '~/core/enum/formacao-homologada';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoProposta, SituacaoPropostaTagDisplay } from '~/core/enum/situacao-proposta';
import { TipoFormacao } from '~/core/enum/tipo-formacao';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { obterDREs } from '~/core/services/dre-service';
import {
  alterarProposta,
  deletarProposta,
  enviarParecer,
  enviarPropostaAnalise,
  inserirProposta,
  obterPropostaPorId,
} from '~/core/services/proposta-service';
import { onClickCancelar } from '~/core/utils/form';
import { scrollNoInicio } from '~/core/utils/functions';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ModalAprovarRecusarButton } from './components/modal-aprovar-recusar/modal-aprovar-recusar-button';
import ModalDevolverButton from './components/modal-devolver/modal-devolver-button';
import ModalImprimirButton from './components/modal-imprimir/modal-imprimir-button';
import { PropostaContext } from './provider';
import FormInformacoesGerais from './steps//formulario-informacoes-gerais/informacoes-gerais';
import FormularioCertificacao from './steps/formulario-certificacao';
import FormularioDatas from './steps/formulario-datas';
import FormularioDetalhamento from './steps/formulario-detalhamento/formulario-detalhamento';
import FormularioProfissionais from './steps/formulario-profissionais';
import InputNumero from '~/components/main/numero';

const stylesButtons = {
  fontWeight: 700,
};

export const FormCadastroDePropostas: React.FC = () => {
  const [form] = useForm();

  const { desabilitarCampos, setDesabilitarCampos, permissao } = useContext(PermissaoContext);
  const rfResponsavelDfWatch = Form.useWatch('rfResponsavelDf', form);

  const [openModalErros, setOpenModalErros] = useState(false);
  const [existePublicoAlvo, setExistePublicoAlvo] = useState(false);
  const [existeFuncaoEspecifica, setFuncaoEspecifica] = useState(false);
  const [recarregarTurmas, setRecarregarTurmas] = useState(false);
  const [listaErros, setListaErros] = useState<string[]>([]);

  const [listaDres, setListaDres] = useState<any[]>([]);

  const [tipoInstituicao, setTipoInstituicao] = useState<AreaPromotoraTipoEnum>();
  const [desabilitarBotaoDevolver, setDesabilitarBotaoDevolver] = useState(true);
  const [exibirBotaoEnviar, setExibirBotaoEnviar] = useState(false);

  const token = useAppSelector((store) => store.auth.token);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado);
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

  const ehPerfilAdminDf =
    perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];

  const ehPerfilDf = perfilSelecionado?.perfilNome === TipoPerfilTagDisplay[TipoPerfilEnum.DF];

  const showModalErros = () => setOpenModalErros(true);
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const pareceristaWatch = Form.useWatch('pareceristas', form)?.length;

  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<StepPropostaEnum>(
    StepPropostaEnum.InformacoesGerais,
  );
  const { formInitialValues, setFormInitialValues } = useContext(PropostaContext);

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const ehAreaPromotora = perfilSelecionado?.perfil === formInitialValues?.areaPromotora?.grupoId;

  const exibirBotaoRascunho =
    !formInitialValues?.situacao || formInitialValues?.situacao === SituacaoProposta.Rascunho;

  const situacaoDevolvida = formInitialValues?.situacao === SituacaoProposta.Devolvida;

  const situacaoAguardandoAnaliseDf =
    formInitialValues?.situacao === SituacaoProposta.AguardandoAnaliseDf;

  const ehAdminDfESituacaoAguardandoAnalisePeloParecerista = ehPerfilAdminDf &&
    formInitialValues.situacao === SituacaoProposta.AguardandoAnalisePeloParecerista;

  const ehFomacaoHomologada = formInitialValues?.formacaoHomologada === FormacaoHomologada.Sim;

  const exibirBotaoDevolver = situacaoAguardandoAnaliseDf && ehFomacaoHomologada;

  const exibirBotaoEnviarConsideracoes = formInitialValues?.podeEnviarConsideracoes;

  const exibirInputNumeroHomologacao =
    formInitialValues?.situacao === SituacaoProposta.Aprovada ||
    formInitialValues?.situacao === SituacaoProposta.Publicada;

  const exibirBotaoSalvar =
    currentStep === StepPropostaEnum.Certificacao ||
    (ehAdminDfESituacaoAguardandoAnalisePeloParecerista && form.isFieldsTouched());

  const exibirJustificativaDevolucao =
    ehAreaPromotora && formInitialValues?.movimentacao?.situacao === SituacaoProposta.Devolvida;

  const exibirJustificativaAprovacaoRecusa = formInitialValues?.ultimaJustificativaAprovacaoRecusa;

  const exibirBotoesAprovarRecusar =
    !!formInitialValues?.podeAprovar && !!formInitialValues?.podeRecusar;

  const situacaoAguardandoAnaliseReanalisePeloParecerista =
    formInitialValues?.situacao === SituacaoProposta.AguardandoAnalisePeloParecerista ||
    formInitialValues.situacao === SituacaoProposta.AguardandoReanalisePeloParecerista;

  const desabilitarBotaoEnviar = () => {
    if (
      ehPerfilAdminDf &&
      (situacaoAguardandoAnaliseDf || situacaoAguardandoAnaliseReanalisePeloParecerista) &&
      !!pareceristaWatch &&
      form.isFieldsTouched()
    ) {
      return false;
    } else if (formInitialValues?.podeEnviar) {
      return false;
    }

    return true;
  };

  const podeExibirCard = ehPerfilAdminDf && ehFomacaoHomologada;

  const podeEditarRfResponsavelDfEPareceristas =
    situacaoAguardandoAnaliseDf ||
    formInitialValues?.situacao === SituacaoProposta.AguardandoAnalisePeloParecerista ||
    formInitialValues?.situacao === SituacaoProposta.AguardandoReanalisePeloParecerista;

  const exibirCard = ehFomacaoHomologada && (podeExibirCard || exibirInputNumeroHomologacao);

  const podeImprimir =
    ((formInitialValues?.situacao === SituacaoProposta.Publicada) || (formInitialValues?.situacao === SituacaoProposta.Aprovada)) &&
    ehFomacaoHomologada;

  const podeEditarNumeroHomologacao = id && ehFomacaoHomologada && formInitialValues?.situacao === SituacaoProposta.Aprovada;

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
        (!ehPerfilAdminDf &&
          formInitialValues?.situacao !== SituacaoProposta.Rascunho &&
          formInitialValues?.situacao !== SituacaoProposta.Cadastrada &&
          formInitialValues?.situacao !== SituacaoProposta.Publicada &&
          formInitialValues?.situacao !== SituacaoProposta.Alterando &&
          !(
            (ehPerfilDf && situacaoAguardandoAnaliseDf) ||
            formInitialValues?.situacao === SituacaoProposta.Aprovada
          ) &&
          !(
            ehAreaPromotora &&
            (situacaoDevolvida ||
              formInitialValues?.situacao === SituacaoProposta.AnaliseParecerPelaAreaPromotora)
          ));

      setDesabilitarCampos(desabilitarTodosFormularios);
    }
  }, [formInitialValues, desabilitarCampos]);

  const carregarValoresDefault = async () => {
    setLoading(true);
    const retornolistaDres = await obterDREs(true);

    const listaDres = retornolistaDres.dados.map((dre) => ({
      ...dre,
      value: dre.id,
      label: dre.descricao,
    }));

    const dresVinculadas = await obterDREVinculada(listaDres);

    const valoresIniciais: PropostaFormDTO = {
      tipoFormacao: TipoFormacao.Curso,
      tiposInscricao: [],
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
      nomeSituacao: SituacaoPropostaTagDisplay[SituacaoProposta.Rascunho],
      desativarAnoEhComponente: false,
    };

    setListaDres(listaDres);

    setFormInitialValues(valoresIniciais);
    setLoading(false);
  };

  const carregarDados = useCallback(async () => {
    setLoading(true);
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

      let tiposInscricao: number[] = [];

      if (dados?.tiposInscricao?.length) {
        tiposInscricao = dados?.tiposInscricao.map((item) => item.tipoInscricao);
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

      let pareceristas: PropostaPareceristaFormDTO[] = [];
      if (dados.pareceristas?.length) {
        pareceristas = dados.pareceristas.map((parecerista) => ({
          id: parecerista.id,
          label: parecerista.nomeParecerista,
          value: parecerista.registroFuncional,
        }));
      }

      let publicosAlvo: number[] = [];
      if (dados?.publicosAlvo?.length) {
        setExistePublicoAlvo(true);
        publicosAlvo = dados.publicosAlvo.map((item) => item.cargoFuncaoId);
      }

      let funcoesEspecificas: number[] = [];
      if (dados?.funcoesEspecificas?.length) {
        setFuncaoEspecifica(true);
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

      const quantidadeTurmasOriginal = dados?.quantidadeTurmas;
      const desativarAnoEhComponente = dados?.desativarAnoEhComponente;
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
        tiposInscricao,
        quantidadeTurmasOriginal,
        desativarAnoEhComponente,
        pareceristas,
      };

      setListaDres(listaDres);
      setFormInitialValues({ ...valoresIniciais });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    scrollNoInicio();
    if (id) {
      carregarDados();
    } else {
      carregarValoresDefault();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  useEffect(() => {
    scrollNoInicio();
  }, [currentStep]);

  useEffect(() => {
    setDesabilitarBotaoDevolver(!form.getFieldValue('rfResponsavelDf'));
  }, [rfResponsavelDfWatch]);

  useEffect(() => {
    setExibirBotaoEnviar(formInitialValues?.podeEnviar || (!(ehPerfilAdminDf && !pareceristaWatch) && form.isFieldsTouched()));
  }, [carregarDados, id, formInitialValues]);

  const salvar = async (ehProximoPasso: boolean, novaSituacao?: SituacaoProposta) => {
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

    let situacao = SituacaoProposta.Rascunho;

    if (id && !novaSituacao && formInitialValues?.situacao) {
      situacao = formInitialValues?.situacao;
    } else if (novaSituacao) {
      situacao = novaSituacao;
    }

    if (ehProximoPasso && situacao === SituacaoProposta.Publicada) {
      situacao = SituacaoProposta.Alterando;
    }

    const valoresSalvar: PropostaDTO = {
      ehProximoPasso,
      formacaoHomologada: clonedValues?.formacaoHomologada,
      tipoFormacao: clonedValues?.tipoFormacao,
      formato: clonedValues?.formato,
      tiposInscricao: [],
      dreIdPropostas: clonedValues?.dreIdPropostas || null,
      nomeFormacao: clonedValues?.nomeFormacao,
      quantidadeTurmas: clonedValues?.quantidadeTurmas || null,
      quantidadeVagasTurma: clonedValues?.quantidadeVagasTurma || null,
      publicosAlvo: [],
      funcoesEspecificas: [],
      funcaoEspecificaOutros: clonedValues?.funcaoEspecificaOutros || '',
      publicoAlvoOutros: clonedValues?.publicoAlvoOutros || '',
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      criterioValidacaoInscricaoOutros: clonedValues?.criterioValidacaoInscricaoOutros || '',
      situacao,
      dataRealizacaoInicio,
      dataRealizacaoFim,
      dataInscricaoInicio,
      dataInscricaoFim,
      cargaHorariaPresencial: clonedValues.cargaHorariaPresencial,
      cargaHorariaNaoPresencial: clonedValues.cargaHorariaNaoPresencial,
      cargaHorariaSincrona: clonedValues.cargaHorariaSincrona,
      cargaHorariaDistancia: clonedValues.cargaHorariaDistancia,
      horasTotais: clonedValues.horasTotais,
      cargaHorariaTotalOutra: clonedValues.cargaHorariaTotalOutra,
      justificativa: clonedValues.justificativa,
      referencia: clonedValues.referencia,
      procedimentoMetadologico: clonedValues.procedimentoMetadologico,
      conteudoProgramatico: clonedValues.conteudoProgramatico,
      objetivos: clonedValues.objetivos,
      palavrasChaves: [],
      criterioCertificacao: [],
      outrosCriterios: clonedValues?.outrosCriterios || '',
      cursoComCertificado: !!clonedValues.cursoComCertificado,
      acaoInformativa: !!clonedValues.acaoInformativa,
      acaoFormativaTexto: clonedValues?.acaoFormativaTexto || '',
      acaoFormativaLink: clonedValues?.acaoFormativaLink || '',
      descricaoDaAtividade: clonedValues.descricaoDaAtividade,
      dres: [],
      turmas: [],
      modalidades: [],
      anosTurmas: [],
      componentesCurriculares: [],
      integrarNoSGA: clonedValues?.integrarNoSGA,
      desativarAnoEhComponente: clonedValues?.desativarAnoEhComponente,
      rfResponsavelDf: clonedValues?.rfResponsavelDf,
      movimentacao: clonedValues?.movimentacao,
      areaPromotora: clonedValues?.areaPromotora,
      ultimaJustificativaDevolucao: clonedValues?.ultimaJustificativaDevolucao,
      linkParaInscricoesExterna: clonedValues?.linkParaInscricoesExterna,
      codigoEventoSigpec: clonedValues?.codigoEventoSigpec,
      numeroHomologacao: clonedValues?.numeroHomologacao || null,
      pareceristas: [],
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
          turma.dresIds =
            item.dres?.length > 1
              ? item.dres?.filter((dre) => !dre.todos).map((d) => d.value)
              : item.dres.map((dre) => dre.value);
        } else {
          turma.dresIds = [];
        }

        if (item.id) {
          turma.id = item.id;
        }
        return turma;
      });
    }

    if (clonedValues?.pareceristas?.length) {
      valoresSalvar.pareceristas = clonedValues.pareceristas.map((item) => {
        const newPareceristas = formInitialValues.pareceristas?.find(
          (newItem) => newItem.value === item.value,
        );

        const id = newPareceristas ? newPareceristas.id : 0;
        const nomeParecerista = newPareceristas ? newPareceristas.label : item.label;
        const registroFuncional = newPareceristas ? newPareceristas.value : item.value;

        const parecerista: PropostaPareceristaDTO = {
          id,
          nomeParecerista,
          registroFuncional,
        };

        return parecerista;
      });
    }

    if (clonedValues?.publicosAlvo?.length) {
      valoresSalvar.publicosAlvo = clonedValues.publicosAlvo.map((cargoFuncaoId) => ({
        cargoFuncaoId,
      }));
    }
    if (clonedValues?.tiposInscricao?.length) {
      valoresSalvar.tiposInscricao = clonedValues.tiposInscricao.map((tipoInscricao) => ({
        tipoInscricao,
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
      const mensagemEmArray = response?.dados?.mensagem?.split('\n');

      notification.success({
        message: 'Sucesso',
        description: (
          <div>
            {mensagemEmArray?.map((linha, index) => (
              <p key={index}>{linha}</p>
            ))}
          </div>
        ),
      });

      if (id) {
        carregarDados();
      } else {
        const novoId = response.dados.entidadeId;
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
      await salvar(true);
      setRecarregarTurmas(true);
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
          await salvar(true).then((response) => {
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
          <FormInformacoesGerais
            formInitialValues={formInitialValues}
            listaDres={listaDres}
            existePublicoAlvo={existePublicoAlvo}
            existeFuncaoEspecifica={existeFuncaoEspecifica}
            tipoInstituicao={tipoInstituicao}
          />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Detalhamento !== stepSelecionado}>
          <FormularioDetalhamento />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Datas !== stepSelecionado}>
          <FormularioDatas recarregarTurmas={recarregarTurmas} />
        </Form.Item>
        <Form.Item hidden={StepPropostaEnum.Profissionais !== stepSelecionado}>
          <FormularioProfissionais recarregarTurmas={recarregarTurmas} />
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
        let situacao = formInitialValues?.situacao;
        if (situacao == SituacaoProposta.Rascunho) {
          situacao = SituacaoProposta.Cadastrada;
        } else if (situacao == SituacaoProposta.Alterando) {
          situacao = SituacaoProposta.Publicada;
        }

        salvar(false, situacao).then((response) => {
          if (response.sucesso) {
            if (ehAreaPromotora) {
              carregarDados();
            } else if (confirmarAntesDeEnviarProposta) {
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

  const enviarProposta = async () => {
    const formacaoHomologada =
      (form.getFieldValue('formacaoHomologada') as FormacaoHomologada) ||
      FormacaoHomologada.NaoCursosPorIN;

    const finalizarEnvioProposta = () =>
      form
        .validateFields()
        .then(() => {
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
        })
        .catch((error: any) => {
          if (error?.errorFields?.length) {
            setListaErros(error.errorFields.map((h: { errors: Array<string> }) => h.errors));
            showModalErros();
          }
        });

    if (ehPerfilAdminDf) {
      const salvarComConfirmacao = async (mensagemConfirmacao: string) => {
        await salvar(false).then((resposta) => {
          if (resposta.sucesso) {
            confirmacao({
              content:
                mensagemConfirmacao,
              onOk() {
                finalizarEnvioProposta();
              }
            })
          }
        });
      };

      // TODO: será criado um campo na tabela do back para controlar a proposta em edicao
      if (formInitialValues.situacao === SituacaoProposta.AguardandoAnaliseDf) {
        await salvarComConfirmacao(DESEJA_ENVIAR_PROPOSTA_PRO_PARECERISTA);
      } else if (formInitialValues.situacao === SituacaoProposta.AguardandoAnaliseParecerPelaDF) {
        await salvarComConfirmacao(DESEJA_ENVIAR_PROPOSTA_PRA_AREA_PROMOTORA);
      } else {
        finalizarEnvioProposta();
      }
    } else {
      confirmacao({
        content:
          formacaoHomologada === FormacaoHomologada.Sim &&
          formInitialValues.situacao !== SituacaoProposta.Aprovada
            ? APOS_ENVIAR_PROPOSTA_ANALISE
            : APOS_ENVIAR_PROPOSTA_PUBLICAR,
        onOk() {
          finalizarEnvioProposta();
        },
      });
    }
  };

  const validarAntesEnviarProposta = () => {
    if (form.isFieldsTouched()) {
      confirmacao({
        content: DESEJA_SALVAR_PROPOSTA_ANTES_DE_ENVIAR,
        onOk() {
          salvarProposta(true);
        },
        onCancel() {
          if (ehPerfilAdminDf) {
            form.resetFields();
          } else {
            enviarProposta();
          }
        },
      });
    } else {
      enviarProposta();
    }
  };

  const finalizarParecer = () => {
    confirmacao({
      content: DESEJA_ENVIAR_PARECER,
      onOk() {
        enviarParecer(id).then((response) => {
          if (response.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: PROPOSTA_ENVIADA,
            });
            carregarDados();
          }
        });
      },
    });
  };

  return (
    <Col>
      <Spin spinning={loading}>
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
                      if (SituacaoProposta.Cadastrada === formInitialValues?.situacao) {
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

                {!!id && (
                  <Col>
                    <ButtonExcluir
                      id={CF_BUTTON_EXCLUIR}
                      onClick={onClickExcluir}
                      disabled={!permissao.podeExcluir}
                    />
                  </Col>
                )}
                {podeImprimir && (
                  <Col>
                    <ModalImprimirButton propostaId={id} disabled={false} />
                  </Col>
                )}

                <Col>
                  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                    {() => (
                      <Button
                        block
                        type='default'
                        id={CF_BUTTON_CANCELAR}
                        onClick={() => onClickCancelar({ form })}
                        style={stylesButtons}
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
                    style={stylesButtons}
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
                    style={stylesButtons}
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
                      onClick={() => salvar(false)}
                      disabled={desabilitarCampos}
                      style={stylesButtons}
                    >
                      Salvar rascunho
                    </Button>
                  </Col>
                )}

                {exibirBotaoDevolver && (
                  <Col>
                    <ModalDevolverButton propostaId={id} disabled={desabilitarBotaoDevolver} />
                  </Col>
                )}

                {exibirBotaoEnviarConsideracoes && (
                  <Col>
                    <Button
                      block
                      type='primary'
                      id={CF_BUTTON_CADASTRAR_PROPOSTA}
                      disabled={!exibirBotaoEnviarConsideracoes}
                      onClick={finalizarParecer}
                      style={stylesButtons}
                    >
                      Enviar Parecer
                    </Button>
                  </Col>
                )}

                {exibirBotaoSalvar && (
                  <Col>
                    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                      {() => (
                        <Button
                          block
                          type='primary'
                          id={CF_BUTTON_CADASTRAR_PROPOSTA}
                          onClick={() => {
                            const publicosAlvosNumeros: number[] =
                              form.getFieldValue('publicosAlvo');
                            const funcoesEspecificasNumeros: number[] =
                              form.getFieldValue('funcoesEspecificas');
                            const modalidade = form.getFieldValue('modalidade');
                            const anosTurmas: number[] = form.getFieldValue('anosTurmas');
                            const componentesCurriculares: number[] =
                              form.getFieldValue('componentesCurriculares');

                            if (
                              publicosAlvosNumeros.length == 0 &&
                              funcoesEspecificasNumeros.length == 0
                            ) {
                              if (
                                modalidade == undefined ||
                                anosTurmas.length == 0 ||
                                componentesCurriculares.length == 0
                              ) {
                                setListaErros([
                                  'É necessário informar o público alvo ou função especifica ou Modalidade com Ano/Etapa com Componente Curricular',
                                ]);
                                showModalErros();
                                return;
                              }
                            }
                            const enviarProposta =
                              formInitialValues?.situacao !== SituacaoProposta.Publicada &&
                              formInitialValues?.situacao !== SituacaoProposta.Alterando;
                            salvarProposta(enviarProposta);
                          }}
                          style={stylesButtons}
                        >
                          Salvar
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                )}

                {exibirBotaoEnviar && (
                  <Col>
                    <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                      {() => (
                        <Button
                          block
                          type='primary'
                          style={stylesButtons}
                          id={CF_BUTTON_ENVIAR_PROPOSTA}
                          onClick={validarAntesEnviarProposta}
                          disabled={desabilitarBotaoEnviar()}
                        >
                          Enviar
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                )}

                {exibirBotoesAprovarRecusar && (
                  <Col>
                    <ModalAprovarRecusarButton
                      propostaId={id}
                      disabled={false}
                      formInitialValues={formInitialValues}
                      carregarDados={carregarDados}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          </HeaderPage>
          <CardInformacoesCadastrante setTipoInstituicao={setTipoInstituicao} />

          {exibirCard && (
            <Col span={24} style={{ marginBottom: 16 }}>
              <CardContent>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={14} lg={12}>
                    <SelectResponsavelDf
                      selectProps={{ disabled: !podeEditarRfResponsavelDfEPareceristas }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={14} lg={12}>
                    <SelectPareceristas
                      selectProps={{
                        disabled: !podeEditarRfResponsavelDfEPareceristas,
                        maxCount: formInitialValues.qtdeLimitePareceristaProposta,
                      }}
                    />
                  </Col>
                  {exibirInputNumeroHomologacao && (
                    <Col xs={24} sm={12} md={14} lg={12}>
                      <InputNumero
                        formItemProps={{
                          name: 'numeroHomologacao',
                          label: 'Número de homologação',
                        }}
                        inputProps={{
                          maxLength: 15,
                          id: CF_INPUT_NUMERO_HOMOLOGACAO,
                          placeholder: 'Número de homologação',
                          disabled: !podeEditarNumeroHomologacao,
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </CardContent>
            </Col>
          )}

          <Badge.Ribbon text={formInitialValues?.nomeSituacao}>
            <CardContent>
              <Divider orientation='left' />
              <Steps current={currentStep} items={stepsProposta} style={{ marginBottom: 55 }} />
              {selecionarTelaStep(currentStep)}
              <Auditoria dados={formInitialValues?.auditoria} />
            </CardContent>
          </Badge.Ribbon>

          {exibirJustificativaDevolucao && (
            <Col span={24} style={{ marginTop: 16 }}>
              <CardContent>
                <Row>
                  <Col xs={24} sm={12} md={14} lg={24}>
                    <AreaTexto
                      formItemProps={{
                        label: 'Justificativa da devolução:',
                      }}
                      textAreaProps={{
                        disabled: true,
                        value: formInitialValues?.ultimaJustificativaDevolucao,
                      }}
                    />
                  </Col>
                </Row>
              </CardContent>
            </Col>
          )}

          {exibirJustificativaAprovacaoRecusa && (
            <Col span={24} style={{ marginTop: 16 }}>
              <CardContent>
                <Col xs={24}>
                  <AreaTexto
                    formItemProps={{
                      label: 'Justificativas de aprovacao/recusa:',
                    }}
                    textAreaProps={{
                      rows: 5,
                      disabled: true,
                      value: formInitialValues?.ultimaJustificativaAprovacaoRecusa,
                    }}
                  />
                </Col>
              </CardContent>
            </Col>
          )}
        </Form>
        {openModalErros && (
          <ModalErroProposta closeModal={() => setOpenModalErros(false)} erros={listaErros} />
        )}
      </Spin>
    </Col>
  );
};
