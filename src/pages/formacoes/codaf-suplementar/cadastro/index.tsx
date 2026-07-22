import { Button, Col, Form, Input, Row } from 'antd';
import type { FormInstance } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import {
  CF_BUTTON_CANCELAR,
  CF_BUTTON_EXCLUIR,
  CF_BUTTON_SALVAR,
  CF_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  obterAnexoCodafParaDownload,
  obterPropostasTurmasComCodaf,
  PropostaTurmaComCodafDTO,
} from '~/core/services/codaf-lista-presenca-service';
import {
  alterarCodafSuplementar,
  AlterarCodafSuplementarDTO,
  AnexoCodafDTO,
  CodafSuplementarDetalheDTO,
  CriarCodafSuplementarDTO,
  criarCodafSuplementar,
  deletarRetificacao,
  excluirCodafSuplementar,
  InscritoDetalheDTO,
  InscritoDTO,
  fazerUploadAnexoCodaf,
  obterCodafOriginal,
  obterCodafSuplementarPorId,
} from '~/core/services/codaf-suplementar-service';
import {
  autocompletarFormacaoComCodaf,
  DadosInscricaoCursistaDTO,
  PropostaAutocompletarDTO,
} from '~/core/services/proposta-service';
import { onClickVoltar } from '~/core/utils/form';
import { SecaoFormulario } from '../../lista-presenca-codaf/cadastro/componentes/secao-formulario';
import {
  SecaoBuscaEListaInscritos,
} from './componentes/secao-busca-lista-inscritos';
import SecaoRetificacoes from '../../lista-presenca-codaf/cadastro/componentes/secao-retificacoes/secao-retificacoes';
import { SecaoAnexos } from '../../lista-presenca-codaf/cadastro/componentes/secao-anexos';
import ModalExcluir from '../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir';
import { calcularAprovacao, extractRetificacoesPayload, hydrateRetificacoesForm } from '~/core/utils/codaf-utils';
import { RegrasAprovacaoCursistaCodafDto } from '~/core/dto/cursista-dto';

export interface CursistaDTO {
  inscricaoId: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number | null;
  atividade: string | null;
  conceitoFinal: string | null;
  aprovado: boolean | null;
}

type ApiError = {
  response?: {
    data?: {
      erros?: string[];
      mensagens?: string[];
    };
  };
  message?: string;
};

type ApiResponseMessage = {
  sucesso?: boolean;
  mensagens?: string[];
};

type RetificacaoFormItem = {
  dataRetificacao: Dayjs | null;
  paginaRetificacaoDom: number;
};

type FormAnexoDTO = UploadFile & {
  arquivoCodigo?: string;
  nomeArquivo?: string;
  tipoAnexoId?: number;
  urlDownload?: string;
  response?: {
    codigo?: string;
  };
};

type CodafFormValues = {
  numeroHomologacao?: number;
  nomeFormacao?: string;
  codigoFormacao?: number;
  turmaId?: number;
  codafId?: number;
  numeroComunicado?: number;
  dataPublicacao?: Dayjs | null;
  paginaComunicado?: number;
  dataPublicacaoDiarioOficial?: Dayjs | null;
  codigoCursoEol?: number | null;
  codigoNivel?: number | null;
  observacao?: string;
  anexos?: FormAnexoDTO[];
  [key: string]:
    | number
    | string
    | Dayjs
    | RetificacaoFormItem
    | FormAnexoDTO[]
    | null
    | undefined;
};

type SalvarBloqueioFields = Pick<
  CodafFormValues,
  | 'numeroComunicado'
  | 'dataPublicacao'
  | 'paginaComunicado'
  | 'dataPublicacaoDiarioOficial'
  | 'codigoCursoEol'
  | 'anexos'
>;

const resolveAtividade = (atividade: string | null): boolean | null => {
  if (atividade === 'S') {
    return true;
  }

  if (atividade === 'N') {
    return false;
  }

  return null;
};

const TEXT_INFO_STYLE = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '100%',
  color: '#42474A',
  marginBottom: 8,
};

const HEADER_TEXT_STYLE = {
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const formatarData = (data: Dayjs | string | number | Date | null | undefined) => {
  if (!data) return null;
  return dayjs(data).format('YYYY-MM-DD');
};

const mapearAnexosParaForm = (anexos?: CodafSuplementarDetalheDTO['anexos']): FormAnexoDTO[] =>
  anexos?.map((anexo) => ({
    uid: anexo.arquivoCodigo,
    name: anexo.nomeArquivo,
    status: 'done',
    xhr: anexo.arquivoCodigo,
    arquivoCodigo: anexo.arquivoCodigo,
    nomeArquivo: anexo.nomeArquivo,
    tipoAnexoId: anexo.tipoAnexoId,
    urlDownload: anexo.urlDownload,
  })) ?? [];

const mapearAnexosParaPayload = (anexos?: FormAnexoDTO[]): AnexoCodafDTO[] =>
  anexos
    ?.map((file) => {
      const arquivoCodigo = file.response?.codigo ?? file.arquivoCodigo;
      const nomeArquivo = file.name ?? file.nomeArquivo;

      if (!arquivoCodigo || !nomeArquivo) {
        return null;
      }

      return {
        arquivoCodigo,
        nomeArquivo,
        tipoAnexoId: 3,
      };
    })
    .filter((item): item is AnexoCodafDTO => item !== null) ?? [];

const mapearInscritosEdicaoParaTabela = (inscritos: InscritoDetalheDTO[]): CursistaDTO[] =>
  inscritos.map((inscrito) => ({
    inscricaoId: inscrito.inscricaoId,
    rfOuCpf: inscrito.documento,
    nomeCursista: inscrito.nome,
    frequencia: inscrito.percentualFrequencia,
    atividade: mapearAtividadeObrigatoria(inscrito.atividadeObrigatorio),
    conceitoFinal: inscrito.conceitoFinal,
    aprovado: inscrito.aprovado,
  }));

function mapearAtividadeObrigatoria(atividadeObrigatorio: boolean | null | undefined) {
  if (atividadeObrigatorio === true) {
    return 'S';
  }

  if (atividadeObrigatorio === false) {
    return 'N';
  }

  return null;
}

function preencherFormularioComDetalhes(
  form: FormInstance<CodafFormValues>,
  dados: CodafSuplementarDetalheDTO,
) {
  form.setFieldsValue({
    numeroHomologacao: dados.numeroHomologacao,
    nomeFormacao: dados.nomeFormacao,
    codigoFormacao: dados.codigoFormacao,
    turmaId: dados.propostaTurmaId,
    numeroComunicado: dados.numeroComunicado,
    dataPublicacao: dados.dataPublicacao ? dayjs(dados.dataPublicacao) : null,
    paginaComunicado: dados.paginaComunicadoDom,
    dataPublicacaoDiarioOficial: dados.dataPublicacaoDom ? dayjs(dados.dataPublicacaoDom) : null,
    codigoCursoEol: dados.codigoCursoEol,
    codigoNivel: dados.codigoNivel,
    observacao: dados.observacao || '',
  });

  const anexos = mapearAnexosParaForm(dados.anexos);

  if (anexos.length > 0) {
    form.setFieldsValue({ anexos });
  }
}

function normalizeDocument(value: string | number) {
  return String(value).replace(/\D/g, '');
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!isApiError(error)) {
    return fallback;
  }

  return (
    error.response?.data?.erros?.[0] ??
    error.response?.data?.mensagens?.[0] ??
    error.message ??
    fallback
  );
}

function getSaveErrorMessage(response: ApiResponseMessage, isEditing: boolean) {
  const msgs = response.mensagens ?? [];

  if (msgs.length > 0) {
    return msgs.join(', ');
  }

  return isEditing ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro';
}

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

export const deveDesabilitarSalvar = (
  certificadoEmitido: boolean,
  campos?: Partial<SalvarBloqueioFields>,
) => {
  if (!certificadoEmitido) {
    return false;
  }

  if (!campos) {
    return true;
  }

  const camposObrigatorios = [
    campos.numeroComunicado,
    campos.dataPublicacao,
    campos.paginaComunicado,
    campos.dataPublicacaoDiarioOficial,
    campos.codigoCursoEol,
  ];

  return camposObrigatorios.some(isEmptyValue) || isEmptyValue(campos.anexos);
};

type ActionButtonsProps = Readonly<{
  navigate: ReturnType<typeof useNavigate>;
  onClickExcluir: () => void;
  onClickSalvar: () => void;
  loading: boolean;
  salvarDesabilitado: boolean;
  formLocks: {
    actions: {
      salvar: { visible: boolean; locked: boolean };
      excluir: { visible: boolean; locked: boolean };
    };
  };
}>;

function ActionButtons({
  navigate,
  onClickExcluir,
  onClickSalvar,
  loading,
  salvarDesabilitado,
  formLocks,
}: ActionButtonsProps) {
  return (
    <Row gutter={[8, 8]}>
      <Col>
        <ButtonVoltar
          onClick={() => onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR })}
          id={CF_BUTTON_VOLTAR}
        />
      </Col>
      {formLocks.actions.excluir.visible && (
        <Col>
          <Button
            type='default'
            disabled={formLocks.actions.excluir.locked}
            onClick={onClickExcluir}
            id={CF_BUTTON_EXCLUIR}
            style={{ fontWeight: 700 }}
          >
            Excluir
          </Button>
        </Col>
      )}
      {formLocks.actions.salvar.visible && (
        <Col>
          <Button
            disabled={formLocks.actions.salvar.locked}
            type='default'
            onClick={() => onClickVoltar({ navigate, route: ROUTES.CODAF_SUPLEMENTAR })}
            id={CF_BUTTON_CANCELAR}
            style={{ fontWeight: 700 }}
          >
            Cancelar
          </Button>
        </Col>
      )}
      {formLocks.actions.salvar.visible && (
        <Col>
          <Button
            disabled={salvarDesabilitado}
            type='primary'
            onClick={onClickSalvar}
            loading={loading}
            id={CF_BUTTON_SALVAR}
            style={{ fontWeight: 700 }}
          >
            Salvar
          </Button>
        </Col>
      )}
    </Row>
  );
}

const CadastroCodafSuplementar: React.FC = () => {
  const [form] = Form.useForm<CodafFormValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [cursistas, setCursistas] = useState<CursistaDTO[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState<boolean>(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  const [turmas, setTurmas] = useState<PropostaTurmaComCodafDTO[]>([]);

  const [codafId, setCodafId] = useState<number | null>(null);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [certificadoEmitido, setCertificadoEmitido] = useState(false);
  const currentStatus: number | null = null;
  const turmaIdWatch = Form.useWatch('turmaId', form);

  const isEditing = Boolean(id);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);
  const [retificacoes, setRetificacoes] = useState<number[]>([1]);
  const [contadorRetificacoes, setContadorRetificacoes] = useState(1);
  const [retificacoesOriginais, setRetificacoesOriginais] = useState<
    Map<number, { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }>
  >(new Map());
  const [regrasAprovacao, setRegrasAprovacao] = useState<RegrasAprovacaoCursistaCodafDto>();

  const viewState = {
    isStarted: currentStatus === 1,
    isWaiting: currentStatus === 2,
    isDone: currentStatus === 3,
  };

  const numeroComunicadoWatch = Form.useWatch('numeroComunicado', form);
  const dataPublicacaoWatch = Form.useWatch('dataPublicacao', form);
  const paginaComunicadoWatch = Form.useWatch('paginaComunicado', form);
  const dataPublicacaoDiarioOficialWatch = Form.useWatch('dataPublicacaoDiarioOficial', form);
  const codigoCursoEolWatch = Form.useWatch('codigoCursoEol', form);
  const anexosWatch = Form.useWatch('anexos', form) as FormAnexoDTO[] | undefined;

  const salvarDesabilitado = deveDesabilitarSalvar(certificadoEmitido, {
    numeroComunicado: numeroComunicadoWatch,
    dataPublicacao: dataPublicacaoWatch,
    paginaComunicado: paginaComunicadoWatch,
    dataPublicacaoDiarioOficial: dataPublicacaoDiarioOficialWatch,
    codigoCursoEol: codigoCursoEolWatch,
    anexos: anexosWatch,
  });

  const formLocks = {
    fields: {
      formulario: {
        numeroHomologacao: viewState.isDone || isEditing,
        turma: viewState.isDone || isEditing,
      },
      informacoesAdicionais: viewState.isDone,
    },
    actions: {
      salvar: { visible: true, locked: !!certificadoEmitido },
      excluir: { visible: true, locked: !!certificadoEmitido },
    },
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const response = await obterCodafSuplementarPorId(Number(id));

        if (!response.sucesso || !response.dados) {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] ?? 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.CODAF_SUPLEMENTAR);
          return;
        }

        const dados = response.dados;
        setRegistroId(dados.id);
        setCodafId(dados.codafId);
        setRegrasAprovacao(dados.regrasAprovacao);
        setCertificadoEmitido(Boolean(dados.certificadoEmitido));

        preencherFormularioComDetalhes(form, dados);

        const hydrationData = hydrateRetificacoesForm(form, dados.retificacoes);

        if (hydrationData) {
          setRetificacoesOriginais(hydrationData.retificacoesMap);
          setRetificacoes(hydrationData.retificacaoKeys);
          setContadorRetificacoes(hydrationData.contadorRetificacoes);
        }

        if (dados.inscritos && dados.inscritos.length > 0) {
          const inscritosCarregados = mapearInscritosEdicaoParaTabela(dados.inscritos);
          setCursistas(inscritosCarregados);
        }
      } catch (error) {
        console.error('Erro ao buscar CODAF suplementar:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [id, form, navigate]);

  const fetchOriginalCodaf = async () => {
    if (!codafId || isEditing) return;

    setLoading(true);
    try {
      const response = await obterCodafOriginal(codafId);

      if (response?.sucesso && response?.dados) {
        const {
          numeroHomologacao,
          nomeFormacao,
          codigoFormacao,
          propostaTurmaId,
          numeroComunicado,
          dataPublicacao,
          paginaComunicadoDom,
          dataPublicacaoDom,
          codigoCursoEol,
          codigoNivel,
          observacao,
          codafId: returnedCodafId,
        } = response.dados;

        form.setFieldsValue({
          numeroHomologacao,
          nomeFormacao,
          codigoFormacao,
          turmaId: propostaTurmaId,
          numeroComunicado,
          dataPublicacao: dataPublicacao ? dayjs(dataPublicacao) : null,
          paginaComunicado: paginaComunicadoDom,
          dataPublicacaoDiarioOficial: dataPublicacaoDom ? dayjs(dataPublicacaoDom) : null,
          codigoCursoEol,
          codigoNivel,
          observacao: observacao || '',
          codafId: returnedCodafId,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CODAF original:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOriginalCodaf();
  }, [codafId]);

  useEffect(() => {
    if (isEditing) {
      return;
    }
    if (!turmaIdWatch) {
      setCodafId(null);
      setCursistas([]);
      return;
    }

    const selectedTurma = turmas.find((t) => t.id === turmaIdWatch);
    setCodafId(selectedTurma?.codafId ?? null);
    setCursistas([]);
  }, [turmaIdWatch, turmas]);

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText || searchText.length === 0) return setOpcoesFormacao([]);

    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacaoComCodaf(searchText);
      if (response?.sucesso && response.dados?.items) {
        const sortedItems = [...response.dados.items].sort(
          (a, b) => a.numeroHomologacao - b.numeroHomologacao,
        );
        setOpcoesFormacao(sortedItems);
      } else {
        setOpcoesFormacao([]);
      }
    } catch (error) {
      console.error('Erro ao buscar formações:', error);
      setOpcoesFormacao([]);
    } finally {
      setLoadingAutocomplete(false);
    }
  };

  const onSelectFormacao = async (_value: string, option: { propostaId: number }) => {
    const proposta = opcoesFormacao.find((p) => p.propostaId === option.propostaId);
    if (!proposta) return;

    setPropostaSelecionada(proposta);
    setRegrasAprovacao(proposta.regrasAprovacao);
    form.setFieldsValue({
      numeroHomologacao: proposta.numeroHomologacao,
      nomeFormacao: proposta.nomeFormacao,
      codigoFormacao: proposta.codigoFormacao,
      turmaId: undefined,
      codafId: undefined,
    });

    setCursistas([]);

    try {
      const response = await obterPropostasTurmasComCodaf(proposta.propostaId);
      if (response?.sucesso && response?.dados) {
        setTurmas(response.dados);
        return;
      }

      setTurmas([]);
      notification.warning({
        message: 'Atenção',
        description: 'Nenhuma turma encontrada para esta formação',
      });
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setTurmas([]);
      notification.error({ message: 'Erro', description: 'Erro ao buscar turmas da formação' });
    }
  };

  const onAdicionarCursista = (novosCursistas: DadosInscricaoCursistaDTO[]) => {
    const cursistasParaAdicionar = novosCursistas.filter((novoCursista) => {
      const documentoNovo = normalizeDocument(novoCursista.documento);

      return !cursistas.some((c) => normalizeDocument(c.rfOuCpf) === documentoNovo);
    });

    if (cursistasParaAdicionar.length === 0) return;

    const novosCursistasDTO: CursistaDTO[] = cursistasParaAdicionar.map((c) => ({
      inscricaoId: c.inscricaoId,
      rfOuCpf: c.documento,
      nomeCursista: c.nome,
      frequencia: null,
      atividade: null,
      conceitoFinal: null,
      aprovado: null,
    }));
    setCursistas((prevCursistas) => [...prevCursistas, ...novosCursistasDTO]);
  };

  const onRemoverCursista = (inscricaoId: number) => {
    setCursistas((prevCursistas) => prevCursistas.filter((c) => c.inscricaoId !== inscricaoId));
  };

  const onChangeCursista = (
    inscricaoId: number,
    field: keyof CursistaDTO,
    value: CursistaDTO[keyof CursistaDTO],
  ) => {
    setCursistas((prevCursistas) =>
      prevCursistas.map((c) => {
      if (c.inscricaoId !== inscricaoId) return c;

      const cursistaAtualizado = { ...c, [field]: value };

      // Gatilho do motor de aprovação
      if (['frequencia', 'atividade', 'conceitoFinal'].includes(field)) {
        const autoAprovado = calcularAprovacao(
          cursistaAtualizado.frequencia,
          cursistaAtualizado.conceitoFinal,
          cursistaAtualizado.atividade,
          regrasAprovacao
        );

        if (autoAprovado !== null) {
          cursistaAtualizado.aprovado = autoAprovado;
        }
      }

      return cursistaAtualizado;
    }),
    );
  };

  const validarInscritos = (listaInscritos: CursistaDTO[]): boolean => {
    const possuiInscritosIncompletos = listaInscritos.some(
      (inscrito) =>
        inscrito.frequencia === null ||
        inscrito.frequencia === undefined ||
        inscrito.atividade === null ||
        inscrito.atividade === undefined ||
        inscrito.conceitoFinal === null ||
        inscrito.conceitoFinal === undefined ||
        inscrito.aprovado === null ||
        inscrito.aprovado === undefined,
    );

    if (possuiInscritosIncompletos) {
      notification.warning({
        message: 'Atenção',
        description:
          'Você precisa preencher a Frequência, Atividade obrigatória, Conceito final e Aprovado para todos os inscritos adicionados antes de salvar.',
      });
      return false;
    }
    return true;
  };

  const handleSaveError = (error: unknown) => {
    const defaultMsg = isEditing ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro';
    const errorDesc = getErrorMessage(error, defaultMsg);

    notification.error({ message: 'Erro', description: errorDesc });
  };

  const generatePayload = (
    formValues: CodafFormValues,
    overrideInscritos?: CursistaDTO[],
  ): CriarCodafSuplementarDTO => {
    const mappedAttachments = mapearAnexosParaPayload(formValues.anexos);

    const attendeeList = Array.isArray(overrideInscritos) ? overrideInscritos : cursistas;
    const mappedAttendees: InscritoDTO[] = attendeeList.map((c) => ({
      inscricaoId: c.inscricaoId,
      percentualFrequencia: c.frequencia ?? null,
      conceitoFinal: c.conceitoFinal ?? null,
      atividadeObrigatorio: resolveAtividade(c.atividade),
      aprovado: c.aprovado ?? null,
    }));
    
    const retificacoesPayload = extractRetificacoesPayload(
      formValues, 
      retificacoes, 
      isEditing ? retificacoesOriginais : undefined
    );

    return {
      propostaId: propostaSelecionada?.propostaId || 0,
      propostaTurmaId: formValues.turmaId || 0,
      dataPublicacao: formatarData(formValues.dataPublicacao),
      dataPublicacaoDom: formatarData(formValues.dataPublicacaoDiarioOficial),
      numeroComunicado: Number(formValues.numeroComunicado) || 0,
      paginaComunicadoDom: Number(formValues.paginaComunicado) || 0,
      codigoCursoEol: Number(formValues.codigoCursoEol) || null,
      codigoNivel: Number(formValues.codigoNivel) || null,
      observacao: formValues.observacao || '',
      inscritos: mappedAttendees,
      anexos: mappedAttachments,
      codafId: codafId ?? 0,
      retificacoes: retificacoesPayload,
    };
  };

  const handleSaveResponse = (response: ApiResponseMessage) => {
    if (response?.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: isEditing ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!',
      });

      navigate(ROUTES.CODAF_SUPLEMENTAR);
    } else {
      const msgStr = getSaveErrorMessage(response, isEditing);
      console.error('Erro da API:', response.mensagens ?? []);
      notification.error({ message: 'Erro ao salvar', description: msgStr });
    }
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]) => {
    try {
      const fields = await form.validateFields();
      const inscritosAtuais = Array.isArray(inscritosOverride) ? inscritosOverride : cursistas;

      if (!validarInscritos(inscritosAtuais)) {
        return;
      }

      setLoading(true);
      const payloadBase = generatePayload(fields, inscritosAtuais);
      
      let res: ApiResponseMessage;

      if (isEditing && id) {
        const payloadEdicao: AlterarCodafSuplementarDTO = {
          codafId: payloadBase.codafId,
          dataPublicacao: payloadBase.dataPublicacao,
          dataPublicacaoDom: payloadBase.dataPublicacaoDom,
          numeroComunicado: payloadBase.numeroComunicado,
          paginaComunicadoDom: payloadBase.paginaComunicadoDom,
          codigoCursoEol: payloadBase.codigoCursoEol,
          codigoNivel: payloadBase.codigoNivel,
          observacao: payloadBase.observacao,
          inscritos: payloadBase.inscritos,
          anexos: payloadBase.anexos,
          retificacoes: payloadBase.retificacoes,
        };

        console.log('Dados enviados para API (PUT):', JSON.stringify(payloadEdicao, null, 2));
        res = await alterarCodafSuplementar(Number(id), payloadEdicao);
      } else {
        console.log('Dados enviados para API (POST):', JSON.stringify(payloadBase, null, 2));
        res = await criarCodafSuplementar(payloadBase);
      }
      handleSaveResponse(res);
    } catch (err: unknown) {
      handleSaveError(err);
    } finally {
      setLoading(false);
    }
  };

  const onClickExcluir = () => {
    setModalExcluirVisivel(true);
  };

  const confirmarExclusao = async () => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'Registro não encontrado',
        });
        setModalExcluirVisivel(false);
        return;
      }

      setLoading(true);
      setModalExcluirVisivel(false);

      const response = await excluirCodafSuplementar(registroId);

      if (response.status === 204) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro excluído com sucesso!',
        });
        navigate(ROUTES.CODAF_SUPLEMENTAR);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao excluir o registro';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error: unknown) {
      console.error('Erro ao excluir:', error);
      const mensagemErro = getErrorMessage(error, 'Erro ao excluir o registro');

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirVisivel(false);
  };

  const onBaixarAnexo = (arquivo: { urlDownload?: string }) => {
    try {
      if (!arquivo.urlDownload) {
        notification.error({
          message: 'Erro',
          description: 'Não foi possível baixar o arquivo. URL de download não encontrada.',
        });
        return;
      }

      window.open(arquivo.urlDownload, '_blank');
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao fazer download do arquivo',
      });
    }
  };

  const aoDeletarRetificacao = async (retificacaoKey: number) => {
    return await deletarRetificacao(retificacaoKey);
  };

  return (
    <Col>
      <HeaderPage title='CODAF Suplementar'>
        <Col span={24}>
          <ActionButtons
            navigate={navigate}
            onClickExcluir={onClickExcluir}
            onClickSalvar={onClickSalvar}
            loading={loading}
            salvarDesabilitado={salvarDesabilitado}
            formLocks={formLocks}
          />
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div style={HEADER_TEXT_STYLE}>
                <div>
                  Aqui você cria um novo CODAF Suplementar. Preencha todas as informações antes de
                  salvar.
                </div>
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            loadingAutocomplete={loadingAutocomplete}
            turmasFiltradas={turmas}
            turmaDisabled={false}
            tooltipAberto={false}
            exibirTooltipTurma={false}
            ehPerfilDF={false}
            ehPerfilEMFORPEF={false}
            camposBloqueados={formLocks.fields.formulario}
            certificadoEmitido={certificadoEmitido}
          />

          <SecaoBuscaEListaInscritos
            cursistas={cursistas}
            onAdicionarCursista={onAdicionarCursista}
            onRemoverCursista={onRemoverCursista}
            onChangeCursista={onChangeCursista}
            propostaTurmaId={turmaIdWatch ?? 0}
            certificadoEmitido={certificadoEmitido}
          />
          <div style={{ display: 'block'}}>
            <SecaoRetificacoes
              retificacoes={retificacoes}
              setRetificacoes={setRetificacoes}
              contadorRetificacoes={contadorRetificacoes}
              setContadorRetificacoes={setContadorRetificacoes}
              retificacoesOriginais={retificacoesOriginais}
              setRetificacoesOriginais={setRetificacoesOriginais}
              form={form}
              camposBaseadosBloqueados={false}
              aoDeletarRetificacao={aoDeletarRetificacao}
              podeAdicionarNovaRetificacao={retificacoes.length < 2}
            />
          </div>
          
          <SecaoAnexos
            form={form}
            podeGerenciarAnexos={true}
            onDownloadAnexo={onBaixarAnexo}
            fazerUploadAnexoCodaf={fazerUploadAnexoCodaf}
            obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
            bloqueado={false}
          />

          <Row gutter={[16, 8]} style={{ marginTop: 32 }}>
            <Col span={24}>
              <div style={TEXT_INFO_STYLE}>Informações adicionais</div>
              <p style={{ marginBottom: 16 }}>
                Insira demais informações importantes para o registro. Este é um campo opcional.
              </p>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Form.Item name='observacao'>
                <Input.TextArea
                  rows={4}
                  placeholder='Digite as informações adicionais...'
                  maxLength={500}
                  disabled={formLocks.fields.informacoesAdicionais}
                />
              </Form.Item>
            </Col>
          </Row>
        </CardContent>
      </Form>

      <ModalExcluir
        visible={modalExcluirVisivel}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        loading={loading}
      />
    </Col>
  );
};

export default CadastroCodafSuplementar;
