import { Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalEnviarDF from './componentes/modal-enviar-df/modal-enviar-df';
import ModalDevolverDF from './componentes/modal-devolver-df/modal-devolver-df';
import ModalExcluir from './componentes/modal-excluir/modal-excluir';
import ModalComentario from './componentes/modal-comentario/modal-comentario';
import ModalAvisoDeltaInscritos from './componentes/modal-aviso-delta-inscritos/modal-aviso-delta-inscritos';
import SecaoRetificacoes from './componentes/secao-retificacoes/secao-retificacoes';
import { BannerDownloadTermo } from './componentes/banner-download-termo';
import { SecaoAnexos } from './componentes/secao-anexos';
import { SecaoListaInscritos } from './componentes/secao-lista-inscritos';
import { SecaoFormulario } from './componentes/secao-formulario';
import { BannerComentarios } from './componentes/banner-comentarios';
import DrawerAtualizacaoInscritos from '~/components/lib/drawer/atualizacao-inscritos/drawer-atualizacao-inscritos';
import { InscritoAtualizacaoDTO } from '~/core/dto/atualizacao-inscritos-dto';
import { TableRowSelection } from 'antd/es/table/interface';
import { DrawerEdicaoLoteCursistas, DadosLoteCursistas } from './componentes/drawer-edicao-lote-cursistas';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  atualizarCodafListaPresenca,
  CodafListaPresencaDetalheDTO,
  ComentarioCodafDTO,
  criarCodafListaPresenca,
  DeltaInscritosDTO,
  devolverCodafParaCorrecao,
  enviarCodafParaDF,
  excluirCodafListaPresenca,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
  obterCodafListaPresencaPorId,
  obterInscritosTurma,
  verificarTurmaPossuiLista,
  obterDeltaInscritosSilencioso,
  deletarRetificacao
} from '~/core/services/codaf-lista-presenca-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { calcularAprovacao, extractRetificacoesPayload, hydrateRetificacoesForm } from '~/core/utils/codaf-utils';
import { RegrasAprovacaoCursistaCodafDto } from '~/core/dto/cursista-dto';
import { useCodafComum } from '~/core/hooks/use-codaf-comum';
import { usePerfilCodaf } from '~/core/hooks/use-perfil-codaf';
import { useTabelaInscritos } from '~/core/hooks/use-tabela-inscritos';
import { SecaoInformacoesAdicionais } from '../../shared/componentes/secao-informacoes-adicionais';
import { useExclusaoCodaf } from '~/core/hooks/use-exclusao-codaf';
import { BotoesAcaoCodaf } from '../../shared/componentes/botoes-acao-codaf';
import { criarColunasCodafHomologado } from '../../shared/componentes/codaf-colunas-factory';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  frequencia: number | null;
  atividade: string | null;
  conceitoFinal: string | null;
  aprovado: boolean | null;
}

const atividadeObrigatorioParaLetra = (valor: boolean | null | undefined): 'S' | 'N' | null => {
  if (valor === null || valor === undefined) return null;
  return valor ? 'S' : 'N';
};

const letraParaAtividadeObrigatorio = (atividade: string | null): boolean | null => {
  if (atividade === 'S') return true;
  if (atividade === 'N') return false;
  return null;
};

const formatarData = (data: any) => {
  if (!data) return null;
  return dayjs(data).format('YYYY-MM-DD');
};

const CadastroListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  
  const { perfil, ehAreaPromotora, ehAreaPromotoraEAdmin } = usePerfilCodaf();
  const { mapearAnexosParaFormulario, onBaixarModelo, onDownloadAnexo, exibirErroSalvar } = useCodafComum();
  const {
  modalExcluirVisible,
  loadingExclusao,
  onClickExcluir,
  cancelarExclusao,
  confirmarExclusao,
} = useExclusaoCodaf(excluirCodafListaPresenca, ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO);

  const {
    cursistas, setCursistas,
    cursistasSelecionadosIds, setCursistasSelecionadosIds,
    paginaAtualInscritos, setPaginaAtualInscritos,
    registrosPorPaginaInscritos,
    totalRegistrosInscritos, setTotalRegistrosInscritos,
    handleTableChangeInscritos,
  } = useTabelaInscritos<CursistaDTO>();

  const [drawerLoteAberto, setDrawerLoteAberto] = useState(false);
  const [drawerLoteModo, setDrawerLoteModo] = useState<'registrar' | 'editar'>('registrar');
  const [regrasAprovacao, setRegrasAprovacao] = useState<RegrasAprovacaoCursistaCodafDto>();

  const cursistasSelecionados = cursistas.filter((c) => cursistasSelecionadosIds.includes(c.id));

  const algumSelecionadoComDados = cursistasSelecionados.some(
    (c) => c.frequencia !== null || c.atividade !== null || c.conceitoFinal !== null || c.aprovado !== null,
  );

  const quantidadeMinimaSelecionada = cursistasSelecionadosIds.length >= 2;

  const registrarDadosDesabilitado = !quantidadeMinimaSelecionada || algumSelecionadoComDados;
  const editarDadosDesabilitado = !quantidadeMinimaSelecionada || !algumSelecionadoComDados;

  const onClickRegistrarDados = () => {
    setDrawerLoteModo('registrar');
    setDrawerLoteAberto(true);
  };

  const onClickEditarDados = () => {
    setDrawerLoteModo('editar');
    setDrawerLoteAberto(true);
  };

const onConfirmarDadosLote = async (dados: DadosLoteCursistas) => {
    const novaListaCursistas = cursistas.map((cursista) =>
      cursistasSelecionadosIds.includes(cursista.id)
        ? {
            ...cursista,
            frequencia: dados.frequencia,
            atividade: dados.atividade,
            conceitoFinal: dados.conceitoFinal,
            aprovado: dados.aprovado,
          }
        : cursista,
    );

    const sucesso = await onClickSalvar(novaListaCursistas);

    if (sucesso) {
      setDrawerLoteAberto(false);
      setCursistasSelecionadosIds([]);
    }
  };

  const [turmasFiltradas, setTurmasFiltradas] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [formValido, setFormValido] = useState(false);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [todasTurmasPossuemLista, setTodasTurmasPossuemLista] = useState(false);
  const [retificacoes, setRetificacoes] = useState<number[]>([1]);
  const [contadorRetificacoes, setContadorRetificacoes] = useState(1);
  const [retificacoesOriginais, setRetificacoesOriginais] = useState<
    Map<number, { id: number; dataRetificacao: string | null; paginaRetificacaoDom: number }>
  >(new Map());
  const [mostrarDivergencia, setMostrarDivergencia] = useState(false);
  const [deltaInscritos, setDeltaInscritos] = useState<DeltaInscritosDTO | null>(null);
  const [modalAvisoDeltaVisible, setModalAvisoDeltaVisible] = useState(false);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [comentario, setComentario] = useState<ComentarioCodafDTO | null>(null);
  const [modalEnviarDFVisible, setModalEnviarDFVisible] = useState(false);
  const [modalDevolverDFVisible, setModalDevolverDFVisible] = useState(false);
  const [modalComentarioVisible, setModalComentarioVisible] = useState(false);
  const [modalDrawerInscritosVisible, setModalDrawerInscritosVisible] = useState(false);
  const [novosInscritosDrawer, setNovosInscritosDrawer] = useState<InscritoAtualizacaoDTO[]>([]);
  const [deltaResolvidoLocalmente, setDeltaResolvidoLocalmente] = useState<DeltaInscritosDTO | null>(null);
  const formOriginal = React.useRef<any>(null);
  const cursistasOriginais = React.useRef<CursistaDTO[]>([]);
  const situacoes = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando DF' },
    { id: 3, descricao: 'Devolvido pelo DF' },
    { id: 4, descricao: 'Finalizado' },
  ];
  const deltasSaoIguais = (d1: DeltaInscritosDTO | null, d2: DeltaInscritosDTO | null) => {
    if (!d1 && !d2) return true;
    if (!d1 || !d2) return false;

    const idsNovos1 = [...d1.inscritosNovos.map((i) => i.id)].sort((a, b) => a - b);
    const idsNovos2 = [...d2.inscritosNovos.map((i) => i.id)].sort((a, b) => a - b);
    if (JSON.stringify(idsNovos1) !== JSON.stringify(idsNovos2)) return false;

    const idsRemovidos1 = [...d1.inscritosRemovidos.map((i) => i.id)].sort((a, b) => a - b);
    const idsRemovidos2 = [...d2.inscritosRemovidos.map((i) => i.id)].sort((a, b) => a - b);
    if (JSON.stringify(idsRemovidos1) !== JSON.stringify(idsRemovidos2)) return false;

    return true;
  };

  const modoEdicao = !!id;
  
  const situacao = {
    iniciado: status === 1,

    aguardandoDF: status === 2,

    devolvidoDF: status === 3,

    finalizado: status === 4,
  };

  const bloqueioDivergenciaSalvar =
    modoEdicao &&
    (situacao.iniciado || situacao.aguardandoDF) &&
    mostrarDivergencia;

  const bloqueioDivergenciaEnviarDF =
    modoEdicao &&
    mostrarDivergencia;

  const bloqueios = {

    campos: {
      secaoFormulario: {
        numeroHomologacao: situacao.finalizado,
        turma: situacao.finalizado,
      },

      listaInscritos: situacao.finalizado,

      retificacoes:
        situacao.finalizado && ehAreaPromotora,

      informacoesAdicionais:
        situacao.finalizado && ehAreaPromotora,
    },

    anexos: {
      areaPromotora: situacao.finalizado && !perfil.cursista && !perfil.admin,
    },

    botoes: {
      excluir: {
        visivel:
          modoEdicao &&
          situacao.iniciado,

        bloqueado:
          situacao.finalizado,
      },

      enviarDF: {
        visivel:
          (
            situacao.iniciado ||
            status === null ||
            situacao.devolvidoDF
          ) &&
          ehAreaPromotora,

        bloqueado:
          situacao.finalizado || bloqueioDivergenciaEnviarDF,
      },

      devolver: {
        visivel:
          situacao.aguardandoDF &&
          perfil.admin,

        bloqueado:
          !formValido ||
          situacao.finalizado,
      },

      salvar: {
        visivel:
          (
            !situacao.aguardandoDF ||
            situacao.aguardandoDF &&
            perfil.admin
          ) && !situacao.finalizado,

        bloqueado: (!modoEdicao && todasTurmasPossuemLista) ||
          situacao.finalizado || bloqueioDivergenciaSalvar,
      },
    },
  };

  const numeroHomologacao = Form.useWatch('numeroHomologacao', form);
  const nomeFormacao = Form.useWatch('nomeFormacao', form);
  const codigoFormacao = Form.useWatch('codigoFormacao', form);
  const turmaId = Form.useWatch('turmaId', form);
  const numeroComunicado = Form.useWatch('numeroComunicado', form);
  const paginaComunicado = Form.useWatch('paginaComunicado', form);
  const codigoCursoEol = Form.useWatch('codigoCursoEol', form);
  const codigoNivel = Form.useWatch('codigoNivel', form);
  const dataPublicacao = Form.useWatch('dataPublicacao', form);
  const dataPublicacaoDiarioOficial = Form.useWatch('dataPublicacaoDiarioOficial', form);

  React.useEffect(() => {
    const camposBasicosPreenchidos =
      numeroHomologacao &&
      nomeFormacao &&
      codigoFormacao &&
      turmaId &&
      numeroComunicado &&
      paginaComunicado &&
      dataPublicacao &&
      dataPublicacaoDiarioOficial;

    const todosPreenchidos = ehAreaPromotora
      ? camposBasicosPreenchidos
      : camposBasicosPreenchidos && codigoCursoEol;

    setFormValido(!!todosPreenchidos);
  }, [
    numeroHomologacao,
    nomeFormacao,
    codigoFormacao,
    turmaId,
    numeroComunicado,
    paginaComunicado,
    codigoCursoEol,
    codigoNivel,
    ehAreaPromotora,
    dataPublicacao,
    dataPublicacaoDiarioOficial,
  ]);

  React.useEffect(() => {
    const aplicarCamposFormulario = (dados: CodafListaPresencaDetalheDTO) => {
      form.setFieldsValue({
        numeroHomologacao: dados.numeroHomologacao,
        nomeFormacao: dados.nomeFormacao,
        codigoFormacao: dados.codigoFormacao,
        turmaId: dados.propostaTurmaId,
        numeroComunicado: dados.numeroComunicado,
        dataPublicacao: dados.dataPublicacao ? dayjs(dados.dataPublicacao) : null,
        paginaComunicado: dados.paginaComunicadoDom,
        dataPublicacaoDiarioOficial: dados.dataPublicacaoDom
          ? dayjs(dados.dataPublicacaoDom)
          : null,
        codigoCursoEol: dados.codigoCursoEol,
        codigoNivel: dados.codigoNivel,
        observacao: dados.observacao || '',
      });

      if (dados.anexos && dados.anexos.length > 0) {
        form.setFieldsValue({
          anexos: mapearAnexosParaFormulario(dados.anexos),
        });
      }
    };

    const aplicarRetificacoes = (dados: CodafListaPresencaDetalheDTO) => {
      if (!dados.retificacoes) return;
      const hydrationData = hydrateRetificacoesForm(form, dados.retificacoes);

      if (hydrationData) {
        setRetificacoesOriginais(hydrationData.retificacoesMap);
        setRetificacoes(hydrationData.retificacaoKeys);
        setContadorRetificacoes(hydrationData.contadorRetificacoes);
      }
    };

    const carregarTurmas = async (dados: CodafListaPresencaDetalheDTO) => {
      try {
        const turmasResponse = await obterTurmasInscricao(dados.propostaId);
        if (!turmasResponse.sucesso || !turmasResponse.dados) return;

        const turmasDisponiveis: RetornoListagemDTO[] = [];
        const turmaSelecionada = turmasResponse.dados.find((t) => t.id === dados.propostaTurmaId);
        if (turmaSelecionada) turmasDisponiveis.push(turmaSelecionada);

        for (const turma of turmasResponse.dados) {
          if (turma.id === dados.propostaTurmaId) continue;
          try {
            const possuiLista = await verificarTurmaPossuiLista(turma.id, dados.id || 0);
            if (possuiLista.sucesso && possuiLista.dados === false) turmasDisponiveis.push(turma);
          } catch (error) {
            console.error(`Erro ao verificar turma ${turma.id}:`, error);
          }
        }

        setTurmasFiltradas(turmasDisponiveis);
        setTurmaDisabled(!!dados.propostaTurmaId);
        setTooltipAberto(false);
        setTodasTurmasPossuemLista(false);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      }
    };

    const carregarDados = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const response = await obterCodafListaPresencaPorId(Number(id));

        if (!response.sucesso || !response.dados) {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] ?? 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO);
          return;
        }

        const dados = response.dados;
        setRegistroId(dados.id);
        setStatus(dados.status);
        setRegrasAprovacao(dados.regrasAprovacao);

        if (dados.comentario) {
          setComentario(dados.comentario);
          setMostrarBanner(true);
        }

        aplicarCamposFormulario(dados);

        if ((dados.retificacoes?.length ?? 0) > 0) aplicarRetificacoes(dados);

        if (dados.deltaInscritos?.houveAlteracao) {
          setMostrarDivergencia(true);
          setDeltaInscritos(dados.deltaInscritos);
        }

        setPropostaSelecionada({
          propostaId: dados.propostaId,
          numeroHomologacao: dados.numeroHomologacao,
          nomeFormacao: dados.nomeFormacao,
          codigoFormacao: dados.codigoFormacao,
        });

        await carregarTurmas(dados);

        setTimeout(() => {
          formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
        }, 100);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        notification.error({
          message: 'Erro',
          description: 'Erro ao carregar dados do registro',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, form, navigate]);


  const buscarInscritos = async () => {
    if (!turmaId) {
      setCursistas([]);
      setTotalRegistrosInscritos(0);
      setPaginaAtualInscritos(1);
      return;
    }

    setLoading(true);
    try {
      const response = await obterInscritosTurma(turmaId, 1, 99999);
      if (response.sucesso && response.dados) {
        const inscritosFormatados = response.dados.items.map((inscrito) => ({
          id: inscrito.id,
          rfOuCpf: inscrito.documento,
          nomeCursista: inscrito.nome,
          frequencia: inscrito.percentualFrequencia ?? null,
          atividade: atividadeObrigatorioParaLetra(inscrito.atividadeObrigatorio),
          conceitoFinal: inscrito.conceitoFinal ?? null,
          aprovado: inscrito.aprovado ?? null,
        }));
        setCursistas(inscritosFormatados);
        setTotalRegistrosInscritos(response.dados.totalRegistros || 0);
        setPaginaAtualInscritos(1);
        setTimeout(() => {
          cursistasOriginais.current = JSON.parse(JSON.stringify(inscritosFormatados));
        }, 100);
      } else {
        setCursistas([]);
        setTotalRegistrosInscritos(0);
        notification.warning({
          message: 'Atenção',
          description: 'Nenhum inscrito encontrado para esta turma',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar inscritos:', error);
      setCursistas([]);
      setTotalRegistrosInscritos(0);
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar inscritos da turma',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    buscarInscritos();
  }, [turmaId]);

  React.useEffect(() => {
    if (turmaId) {
      buscarInscritos();
    }
  }, [registrosPorPaginaInscritos]);

  const handleCursistaChange = useCallback((id: number, field: string, value: any) => {
    setCursistas(prev => prev.map(c => {
      if (c.id !== id) return c;
      const att = { ...c, [field]: value };
      if (['frequencia', 'atividade', 'conceitoFinal'].includes(field)) {
        const auto = calcularAprovacao(att.frequencia, att.conceitoFinal, att.atividade, regrasAprovacao);
        if (auto !== null) att.aprovado = auto;
      }
      return att;
    }));
  }, [regrasAprovacao, setCursistas]);

  const colunasCursistas = criarColunasCodafHomologado(
    paginaAtualInscritos, 
    registrosPorPaginaInscritos, 
    bloqueios.campos.listaInscritos, 
    handleCursistaChange
  );

  const rowSelection: TableRowSelection<CursistaDTO> = {
    selectedRowKeys: cursistasSelecionadosIds,
    onChange: (selectedRowKeys) => {
      setCursistasSelecionadosIds(selectedRowKeys as number[]);
    },
    preserveSelectedRowKeys: true,
    getCheckboxProps: () => ({
      disabled: bloqueios.campos.listaInscritos,
    }),
  };

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText || searchText.length < 0) {
      setOpcoesFormacao([]);
      return;
    }

    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacao(searchText);
      if (response.sucesso && response.dados && response.dados.items) {
        setOpcoesFormacao(
          response.dados.items.sort((a, b) => a.numeroHomologacao - b.numeroHomologacao),
        );
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

  const onSelectFormacao = async (_value: string, option: any) => {
    const proposta = opcoesFormacao.find((p) => p.propostaId === option.propostaId);
    if (proposta) {
      setPropostaSelecionada(proposta);
      setRegrasAprovacao(proposta.regrasAprovacao);
      form.setFieldsValue({
        numeroHomologacao: proposta.numeroHomologacao,
        nomeFormacao: proposta.nomeFormacao,
        codigoFormacao: proposta.codigoFormacao,
        turmaId: undefined,
      });

      setTodasTurmasPossuemLista(false);

      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {

          const turmasDisponiveis: RetornoListagemDTO[] = [];
          for (const turma of response.dados) {
            try {
              const possuiLista = await verificarTurmaPossuiLista(turma.id, 0);
              if (possuiLista.sucesso && possuiLista.dados === false) {
                turmasDisponiveis.push(turma);
              }
            } catch (error) {
              console.error(`Erro ao verificar turma ${turma.id}:`, error);
            }
          }

          if (turmasDisponiveis.length === 0) {
            // Se não sobrar nenhuma turma, deixe apenas a primeira e desabilite
            const primeiraTurma = response.dados.length > 0 ? response.dados[0] : null;
            if (primeiraTurma) {
              setTurmasFiltradas([primeiraTurma]);
              form.setFieldValue('turmaId', primeiraTurma.id);
            } else {
              setTurmasFiltradas([]);
            }
            setTurmaDisabled(true);
            setTooltipAberto(true);
            // Marca que todas as turmas possuem lista (modo criação)
            setTodasTurmasPossuemLista(true);
          } else {
            setTurmasFiltradas(turmasDisponiveis);
            setTurmaDisabled(false);
            setTooltipAberto(false);
            setTodasTurmasPossuemLista(false);
          }
        } else {
          setTurmasFiltradas([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar turmas da formação',
        });
      }
    }
  };

  const tratarRespostaSalvar = (response: any) => {
    if (response.sucesso) {
      formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
      cursistasOriginais.current = JSON.parse(JSON.stringify(cursistas));
      notification.success({
        message: 'Sucesso',
        description: modoEdicao ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!',
      });
      if (!id) {
        navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO_EDITAR.replace(':id', response.dados.id));
      }
    } else {
      const mensagensErro = response.mensagens ?? [];
      const mensagemPadrao = modoEdicao
        ? 'Erro ao atualizar o registro'
        : 'Erro ao salvar o registro';
      const mensagemDetalhada =
        mensagensErro.length > 0 ? mensagensErro.join(', ') : mensagemPadrao;
      console.error('Erro da API:', mensagensErro);
      notification.error({ message: 'Erro ao salvar', description: mensagemDetalhada });
    }
  };

  const recarregarAnexos = async (registroIdAtual: number) => {
    const detalhes = await obterCodafListaPresencaPorId(registroIdAtual);
    if (detalhes.sucesso && detalhes.dados?.anexos) {
      form.setFieldsValue({ anexos: mapearAnexosParaFormulario(detalhes.dados.anexos) });
    }
  };

  const houveAlteracaoInscritosAoSalvar = async (idRegistroSelecionado: number) => {
    const response = await obterDeltaInscritosSilencioso(idRegistroSelecionado);
    if (response.sucesso && response.dados) {
      const dados = response.dados;

      if (dados.deltaInscritos?.houveAlteracao) {
        if (deltasSaoIguais(dados.deltaInscritos, deltaResolvidoLocalmente)) {
          return false;
        }

        setDeltaInscritos(dados.deltaInscritos);
        setMostrarDivergencia(true);
        setModalAvisoDeltaVisible(true);
        setDeltaResolvidoLocalmente(null);
        return true;
      }
    }
    return false;
  };

  const montarPayloadSalvar = (values: any, inscritosOverride?: CursistaDTO[]) => {
    const anexosMapeados = values.anexos?.map((arquivo: any) => ({
      arquivoCodigo: arquivo.response?.codigo ?? arquivo.arquivoCodigo,
      nomeArquivo: arquivo.name || arquivo.nomeArquivo,
      tipoAnexoId: 3,
    })) ?? [];

    const inscritosBase = Array.isArray(inscritosOverride) ? inscritosOverride : cursistas;
    const retificacoesPayload = extractRetificacoesPayload(
      values, 
      retificacoes, 
      modoEdicao ? retificacoesOriginais : undefined
    );

    return {
      propostaId: propostaSelecionada?.propostaId || 0,
      propostaTurmaId: values.turmaId || 0,
      dataPublicacao: formatarData(values.dataPublicacao),
      dataPublicacaoDom: formatarData(values.dataPublicacaoDiarioOficial),
      numeroComunicado: Number(values.numeroComunicado) || 0,
      paginaComunicadoDom: Number(values.paginaComunicado) || 0,
      codigoCursoEol: Number(values.codigoCursoEol) || null,
      codigoNivel: Number(values.codigoNivel) || null,
      observacao: values.observacao || '',
      inscritos: inscritosBase.map((cursista) => ({
        inscricaoId: cursista.id,
        percentualFrequencia: cursista.frequencia ?? null,
        conceitoFinal: cursista.conceitoFinal ?? null,
        atividadeObrigatorio: letraParaAtividadeObrigatorio(cursista.atividade),
        aprovado: cursista.aprovado ?? null,
      })),
      anexos: anexosMapeados,
      retificacoes: retificacoesPayload,
    };
  };

  const atualizarDivergenciaPosSalvar = async (registroIdAtual: number | string) => {
    try {
      const detalhes = await obterCodafListaPresencaPorId(Number(registroIdAtual));
      if (detalhes.sucesso && detalhes.dados?.deltaInscritos?.houveAlteracao) {
        setDeltaInscritos(detalhes.dados.deltaInscritos);
        setMostrarDivergencia(true);
      }
    } catch (error) {
      console.error('Erro ao verificar delta de inscritos após salvar:', error);
    }
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]): Promise<boolean> => {
    try {
      if (registroId && await houveAlteracaoInscritosAoSalvar(registroId)) {
        return false;
      }

      const values = await form.validateFields();
      setLoading(true);

      const dados = montarPayloadSalvar(values, inscritosOverride);

      const response = modoEdicao
        ? await atualizarCodafListaPresenca(registroId ?? 0, dados)
        : await criarCodafListaPresenca(dados);
        
      tratarRespostaSalvar(response);

      if (response.sucesso) {
        setDeltaResolvidoLocalmente(null);
        const registroIdAtual = id ?? response.dados?.id;

        if (registroIdAtual) {
          await recarregarAnexos(Number(registroIdAtual));
          await atualizarDivergenciaPosSalvar(registroIdAtual);
        }

        if (inscritosOverride) {
          setCursistas(inscritosOverride);
        }

        return true;
      }

      return false;
    } catch (error: any) {
      exibirErroSalvar(error, modoEdicao);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO });
  };

  const sanitizarDadosParaComparacao = (dados: any) => {
    if (!dados) return dados;

    console.log('Sanitizando dados para comparação:', dados);

    const copia = JSON.parse(JSON.stringify(dados));

    if (copia.anexos && Array.isArray(copia.anexos)) {
      copia.anexos = copia.anexos.map((anexo: any) => ({
        arquivoCodigo: anexo.arquivoCodigo || anexo.response?.codigo || anexo.uid,
        nomeArquivo: anexo.nomeArquivo || anexo.name
      }));

      copia.anexos.sort((a: any, b: any) => 
        (a.arquivoCodigo || '').localeCompare(b.arquivoCodigo || '')
      );

      console.log('Sanitização de anexos concluída:', copia.anexos);
    }

    return copia;
  }

  const verificarAlteracoes = () => {
    if (!modoEdicao || !formOriginal.current) return false;

    const formAtual = form.getFieldsValue();
    
    const formOriginalSanitizado = sanitizarDadosParaComparacao(formOriginal.current);
    const formAtualSanitizado = sanitizarDadosParaComparacao(formAtual);

    const formOriginalStr = JSON.stringify(formOriginalSanitizado);
    const formAtualStr = JSON.stringify(formAtualSanitizado);
    const cursistasOriginaisStr = JSON.stringify(cursistasOriginais.current);
    const cursistasAtuaisStr = JSON.stringify(cursistas);

    return formOriginalStr !== formAtualStr || cursistasOriginaisStr !== cursistasAtuaisStr;
  };

  const validarParaEnvio = (): boolean => {
    if (!registroId) {
      notification.warning({ message: 'Atenção', description: 'É necessário salvar o registro antes de enviar para DF' });
      return false;
    }

    if (verificarAlteracoes()) {
      notification.warning({ message: 'Atenção', description: 'Você possui alterações não salvas. Por favor, salve antes de enviar.' });
      return false;
    }

    if (!form.getFieldValue('anexos')?.length) {
      notification.warning({ message: 'Atenção', description: 'É necessário anexar pelo menos um arquivo antes de enviar para DF' });
      return false;
    }

    const camposObrigatorios = [
      { valor: numeroHomologacao, nome: 'Número de homologação' },
      { valor: nomeFormacao, nome: 'Nome da formação' },
      { valor: codigoFormacao, nome: 'Código da formação' },
      { valor: turmaId, nome: 'Turma' },
      { valor: numeroComunicado, nome: 'Número do comunicado' },
      { valor: paginaComunicado, nome: 'Página do comunicado' },
      { valor: dataPublicacao, nome: 'Data de publicação' },
      { valor: dataPublicacaoDiarioOficial, nome: 'Data de publicação no Diário Oficial' },
      ...(!ehAreaPromotora ? [{ valor: codigoCursoEol, nome: 'Código do curso no EOL' }] : []),
    ];

    const camposVazios = camposObrigatorios.filter((c) => !c.valor).map((c) => c.nome);

    if (camposVazios.length > 0) {
      notification.warning({
        message: 'Atenção',
        description: `Os seguintes campos não possuem valores validos: (${camposVazios.join(', ')})`,
      });
      return false;
    }

    if (cursistas.length === 0) {
      notification.warning({ message: 'Atenção', description: 'Não é possível enviar para DF sem inscritos na lista de presença' });
      return false;
    }

    const possuiCursistaIncompleto = cursistas.some(
      (c) => c.frequencia === null || c.conceitoFinal === null || c.aprovado === null
    );

    if (possuiCursistaIncompleto) {
      notification.warning({
        message: 'Atenção',
        description: 'Você precisa preencher a Frequência, Conceito Final e Aprovado em todos os inscritos para prosseguir',
      });
      return false;
    }

    return true;
  };

  const onClickEnviarParaDF = async () => {
    if (mostrarDivergencia) {
      notification.warning({
        message: 'Atenção',
        description: 'Você precisa atualizar a listagem de inscritos antes.',
      });
      return;
    }

    if (registroId) {
      setLoading(true);
      const houveDivergencia = await houveAlteracaoInscritosAoSalvar(registroId);
      setLoading(false);

      if (houveDivergencia) {
        return;
      }
    }

    if (!validarParaEnvio()) {
      return;
    }

    if (turmaId) {
      setLoading(true);
      try {
        const response = await obterInscritosTurma(turmaId, 1, 99999);
        if (response.sucesso && response.dados) {
          const idsApi = new Set(response.dados.items.map((i) => i.id));
          const idsLocais = new Set(cursistas.map((c) => c.id));
          const sincronizado =
            idsApi.size === idsLocais.size && [...idsApi].every((id) => idsLocais.has(id));

          if (!sincronizado) {
            notification.warning({
              message: 'Atenção',
              description:
                'Houve alterações nas inscrições desta formação. Aguarde alguns instantes, estamos atualizando a lista para você.',
            });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar inscritos:', error);
      } finally {
        setLoading(false);
      }
    }

    setModalEnviarDFVisible(true);
  };

  const onClickDevolverParaDF = async () => {
    if (!validarParaEnvio()) {
      return;
    }
    setModalDevolverDFVisible(true);
  };

  const confirmarEnvioParaDF = async () => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'É necessário salvar o registro antes de enviar para DF',
        });
        setModalEnviarDFVisible(false);
        return;
      }

      setLoading(true);
      setModalEnviarDFVisible(false);

      const response = await enviarCodafParaDF(registroId);

      if (response.status === 200) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro enviado para DF com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao enviar o registro para DF';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error: any) {
      console.error('Erro ao enviar para DF:', error);
      const mensagemErro =
        error?.response?.data?.erros?.[0] ||
        error?.response?.data?.mensagens?.[0] ||
        error?.message ||
        'Erro ao enviar o registro para DF';

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarEnvioParaDF = () => {
    setModalEnviarDFVisible(false);
  };

  const confirmarDevolucaoParaDF = async (justificativa: string) => {
    if (!validarParaEnvio()) {
      setModalDevolverDFVisible(false);
      return;
    }

    try {
      setLoading(true);
      setModalDevolverDFVisible(false);

      const response = await devolverCodafParaCorrecao(registroId!, justificativa);

      if (response.status === 200) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro devolvido para correção com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO);
      } else {
        const mensagemErro =
          response.mensagens && response.mensagens.length > 0
            ? response.mensagens.join(', ')
            : 'Erro ao devolver o registro para correção';

        notification.error({
          message: 'Erro',
          description: mensagemErro,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao devolver o registro para correção',
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarDevolucaoParaDF = () => {
    setModalDevolverDFVisible(false);
  };

  const onClickAtualizarInscritos = () => {
    if (!turmaId) {
      notification.warning({
        message: 'Atenção',
        description: 'Selecione uma turma para atualizar os inscritos',
      });
      return;
    }

    const novos = deltaInscritos?.inscritosNovos ?? [];
    const removidos = deltaInscritos?.inscritosRemovidos ?? [];

    if (novos.length === 0) {
      const idsRemovidos = removidos.map((r) => r.id);
      const listaSemRemovidos = cursistas.filter((c) => !idsRemovidos.includes(c.id));

      setMostrarDivergencia(false);
      setCursistas(listaSemRemovidos);
      setDeltaResolvidoLocalmente(deltaInscritos);

      return;
    }

    const inscritosMapeadosParaDrawer: InscritoAtualizacaoDTO[] = novos.map((novo) => {
      const salvoLocal = cursistas.find((c) => c.id === novo.id);

      let freq = salvoLocal?.frequencia?.toString() ?? (novo.percentualFrequencia !== null ? novo.percentualFrequencia.toString() : undefined);

      let ativ: 'Sim' | 'Não' | undefined = undefined;
      if (salvoLocal?.atividade === 'S') ativ = 'Sim';
      else if (salvoLocal?.atividade === 'N') ativ = 'Não';
      else if (novo.atividadeObrigatorio === true) ativ = 'Sim';
      else if (novo.atividadeObrigatorio === false) ativ = 'Não';

      let conceito = salvoLocal?.conceitoFinal ?? novo.conceitoFinal ?? undefined;

      let aprov: 'Sim' | 'Não' | undefined = undefined;
      if (salvoLocal?.aprovado === true) aprov = 'Sim';
      else if (salvoLocal?.aprovado === false) aprov = 'Não';
      else if (novo.aprovado === true) aprov = 'Sim';
      else if (novo.aprovado === false) aprov = 'Não';

      return {
        id: novo.id,
        nome: novo.nome,
        documento: novo.documento,
        frequencia: freq,
        atividadeObrigatoria: ativ,
        conceitoFinal: conceito,
        aprovado: aprov,
      };
    });

    setNovosInscritosDrawer(inscritosMapeadosParaDrawer);
    setModalDrawerInscritosVisible(true);
  };

  const onSaveDrawerInscritos = async (novosInscritosPreenchidos: InscritoAtualizacaoDTO[]) => {
    try {
      const idsRemovidos = deltaInscritos?.inscritosRemovidos?.map((r) => r.id) ?? [];
      const idsNovos = novosInscritosPreenchidos.map((i) => i.id);

      const cursistasAtuaisFiltrados = cursistas.filter((c) => !idsRemovidos.includes(c.id) && !idsNovos.includes(c.id));

      const novosCursistas: CursistaDTO[] = novosInscritosPreenchidos.map((inscrito) => ({
        id: inscrito.id,
        rfOuCpf: inscrito.documento,
        nomeCursista: inscrito.nome,
        frequencia: inscrito.frequencia ? parseInt(inscrito.frequencia.replace(/\D/g, ''), 10) : null,
        atividade: inscrito.atividadeObrigatoria ?? null,
        conceitoFinal: inscrito.conceitoFinal ?? null,
        aprovado: inscrito.aprovado === 'Sim',
      }));

      const listaFinal = [...cursistasAtuaisFiltrados, ...novosCursistas];

      setCursistas(listaFinal);
      setMostrarDivergencia(false);
      setModalDrawerInscritosVisible(false);
      setDeltaResolvidoLocalmente(deltaInscritos);
    } catch (error) {
      console.error('Erro ao salvar inscritos do drawer:', error);
      notification.error({
        message: 'Erro',
        description: 'Falha ao processar os novos inscritos',
      });
    } finally {
      setLoading(false);
    }
  };

  const onAtualizarInscritosModal = () => {
    setModalAvisoDeltaVisible(false);
    onClickAtualizarInscritos();
  };

  const onConferirComentarios = () => {
    if (!comentario) {
      notification.warning({
        message: 'Atenção',
        description: 'Nenhum comentário disponível',
      });
      return;
    }

    setModalComentarioVisible(true);
  };

  const onCloseModalComentario = () => {
    setModalComentarioVisible(false);
  };

  const cursistasParaTabela = cursistas.filter((cursista) => {
    if (!mostrarDivergencia || !deltaInscritos) return true;

    const isNovo = deltaInscritos.inscritosNovos?.some((novo) => novo.id === cursista.id);
    const isRemovido = deltaInscritos.inscritosRemovidos?.some((removido) => removido.id === cursista.id);

    return !isNovo && !isRemovido;
  });

  const aoDeletarRetificacao = async (retificacaoKey: number) => {
    return await deletarRetificacao(retificacaoKey);
  }

  return (
    <Col>
      <HeaderPage
        title={modoEdicao ? 'Edição - Lista Presença Codaf' : 'Cadastro - Lista Presença Codaf'}
      >
        <Col span={24}>
          <BotoesAcaoCodaf
            bloqueiosBotoes={bloqueios.botoes}
            loading={loading}
            formValido={formValido}
            onClickVoltar={onClickCancelar}
            onClickExcluir={onClickExcluir}
            onClickCancelar={onClickCancelar}
            onClickSalvar={() => onClickSalvar()}
            onClickEnviarParaDF={onClickEnviarParaDF}
            onClickDevolverParaDF={onClickDevolverParaDF}
          />
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          {mostrarBanner && status === 3 && ehAreaPromotora && (
            <BannerComentarios
              comentario={comentario}
              onConferirComentarios={onConferirComentarios}
              loading={loading}
            />
          )}

          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div
                style={{
                  paddingBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  Aqui você cria um novo CODAF. Preencha todas as informações antes de enviar a
                  aprovação da Divisão de Formação (DF).
                </div>
                {modoEdicao && status !== null && (
                  <div
                    style={{
                      backgroundColor: '#FF9A52',
                      color: '#fff',
                      borderRadius: 50,
                      padding: '4px 16px',
                      fontWeight: 700,
                      fontSize: 14,
                      whiteSpace: 'nowrap',
                      marginLeft: 16,
                    }}
                  >
                    <b>Situação:</b> {situacoes.find((s) => s.id === status)?.descricao || 'Desconhecido'}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            loadingAutocomplete={loadingAutocomplete}
            turmasFiltradas={turmasFiltradas}
            turmaDisabled={turmaDisabled}
            tooltipAberto={tooltipAberto}
            ehPerfilDF={perfil.df}
            ehPerfilEMFORPEF={perfil.emforpef}
            camposBloqueados={bloqueios.campos.secaoFormulario}
          />
          <SecaoListaInscritos
            mostrarDivergencia={mostrarDivergencia}
            deltaInscritos={deltaInscritos}
            nomeFormacao={nomeFormacao}
            onClickAtualizarInscritos={onClickAtualizarInscritos}
            loading={loading}
            colunasCursistas={colunasCursistas}
            cursistas={cursistasParaTabela}
            paginaAtualInscritos={paginaAtualInscritos}
            registrosPorPaginaInscritos={registrosPorPaginaInscritos}
            totalRegistrosInscritos={totalRegistrosInscritos}
            handleTableChangeInscritos={handleTableChangeInscritos}
            rowSelection={rowSelection}
            quantidadeSelecionados={cursistasSelecionadosIds.length}
            onClickRegistrarDados={onClickRegistrarDados}
            onClickEditarDados={onClickEditarDados}
            registrarDadosDesabilitado={registrarDadosDesabilitado}
            editarDadosDesabilitado={editarDadosDesabilitado}
          />
          <DrawerEdicaoLoteCursistas
            open={drawerLoteAberto}
            modo={drawerLoteModo}
            quantidadeSelecionados={cursistasSelecionadosIds.length}
            loading={false}
            onClose={() => setDrawerLoteAberto(false)}
            onConfirmar={onConfirmarDadosLote}
            regrasAprovacao={regrasAprovacao}
          />

          <div style={{ display: ehAreaPromotoraEAdmin ? 'block' : 'none' }}>
            <SecaoRetificacoes
              retificacoes={retificacoes}
              setRetificacoes={setRetificacoes}
              contadorRetificacoes={contadorRetificacoes}
              setContadorRetificacoes={setContadorRetificacoes}
              retificacoesOriginais={retificacoesOriginais}
              setRetificacoesOriginais={setRetificacoesOriginais}
              form={form}
              camposBaseadosBloqueados={bloqueios.campos.retificacoes}
              aoDeletarRetificacao={aoDeletarRetificacao}
              podeAdicionarNovaRetificacao={true}
            />
          </div>
          <SecaoAnexos
            form={form}
            podeGerenciarAnexos={!perfil.cursista}
            onDownloadAnexo={onDownloadAnexo}
            fazerUploadAnexoCodaf={fazerUploadAnexoCodaf}
            obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
            bloqueado={bloqueios.anexos.areaPromotora}
          />

          <BannerDownloadTermo onBaixarModelo={onBaixarModelo} />

          <SecaoInformacoesAdicionais disabled={bloqueios.campos.informacoesAdicionais} />
        </CardContent>
      </Form>

      <ModalAvisoDeltaInscritos
        visible={modalAvisoDeltaVisible}
        nomeFormacao={nomeFormacao}
        deltaInscritos={deltaInscritos}
        onCancel={() => setModalAvisoDeltaVisible(false)}
        onAtualizar={onAtualizarInscritosModal}
      />

      <ModalEnviarDF
        visible={modalEnviarDFVisible}
        onConfirm={confirmarEnvioParaDF}
        onCancel={cancelarEnvioParaDF}
        loading={loading}
      />

      <ModalDevolverDF
        visible={modalDevolverDFVisible}
        onConfirm={confirmarDevolucaoParaDF}
        onCancel={cancelarDevolucaoParaDF}
        loading={loading}
      />

      <ModalExcluir
        visible={modalExcluirVisible}
        onConfirm={() => confirmarExclusao(registroId)}
        onCancel={cancelarExclusao}
        loading={loading|| loadingExclusao}
      />

      <ModalComentario
        visible={modalComentarioVisible}
        onClose={onCloseModalComentario}
        comentario={comentario}
      />

      <DrawerAtualizacaoInscritos
        openModal={modalDrawerInscritosVisible}
        onCloseModal={() => setModalDrawerInscritosVisible(false)}
        onSave={onSaveDrawerInscritos}
        inscritos={novosInscritosDrawer}
        regrasAprovacao={regrasAprovacao}
      />
    </Col>
  );
};

export default CadastroListaPresencaCodaf;
