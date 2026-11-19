import { Badge, Col, Form, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { TableRowSelection } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import Auditoria from '~/components/main/text/auditoria';
import { AuditoriaDTO } from '~/core/dto/auditoria-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import {
  SituacaoCodafConferenciaTagDisplay,
  StatusCodafConferencia,
} from '~/core/enum/status-codaf-conferencia';
import { useCodafComum } from '~/core/hooks/use-codaf-comum';
import { useExclusaoCodaf } from '~/core/hooks/use-exclusao-codaf';
import { usePerfilCodaf } from '~/core/hooks/use-perfil-codaf';
import { useTabelaInscritos } from '~/core/hooks/use-tabela-inscritos';
import {
  atualizarCodafConferencia,
  CodafConferenciaCadastroDTO,
  CodafConferenciaDetalheDTO,
  criarCodafConferencia,
  excluirCodafConferencia,
  fazerUploadAnexoCodafConferencia,
  obterCodafConferenciaPorId,
  obterDetalhesPropostaConferenciaComTurmasPorId,
  obterInscritosTurmaConferencia,
  verificarTurmaPossuiCodafConferencia,
} from '~/core/services/codaf-conferencia-service';
import { obterAnexoCodafParaDownload } from '~/core/services/codaf-lista-presenca-service';
import { onClickVoltar } from '~/core/utils/form';
import {
  DadosLoteCursistas,
  DrawerEdicaoLoteCursistas,
} from '../../formacoes-nao-homologadas/cadastro/componentes/drawer-edicao-lote-cursistas';
import { SecaoListaInscritos } from '../../formacoes-nao-homologadas/cadastro/componentes/secao-lista-inscritos';
import ModalExcluir from '../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir';
import { SecaoAnexos } from '../../lista-presenca-codaf/cadastro/componentes/secao-anexos';
import { BotoesAcaoCodaf } from '../../shared/componentes/botoes-acao-codaf';
import { criarColunasCodafNaoHomologado } from '../../shared/componentes/codaf-colunas-factory';
import { SecaoInformacoesAdicionais } from '../../shared/componentes/secao-informacoes-adicionais';
import {
  SecaoFormularioConferencia,
  TurmaConferenciaOptionDTO,
} from './componentes/secao-formulario';

dayjs.locale('pt-br');

export interface CursistaConferenciaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  participou: boolean | null;
}

export const TIPO_FORMACAO_CONFERENCIA = 3;
export const TOOLTIP_NAO_IMPLEMENTADO = 'Não implementado!';

export interface CadastroCodafConferenciaProps {
  edicaoEExclusaoHabilitadas?: boolean;
}

export const validarArquivoPdf = (arquivo?: { name?: string; type?: string } | null): boolean => {
  if (!arquivo?.name) return false;
  const extensaoValida = arquivo.name.toLowerCase().endsWith('.pdf');
  const mimeValido = !arquivo.type || arquivo.type === 'application/pdf';
  return extensaoValida && mimeValido;
};

const CadastroCodafConferencia: React.FC<CadastroCodafConferenciaProps> = ({
  edicaoEExclusaoHabilitadas = false,
}) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [carregando, setCarregando] = useState(false);

  const { ehAreaPromotora, ehAreaPromotoraEAdmin } = usePerfilCodaf();
  const { mapearAnexosParaFormulario, onDownloadAnexo, exibirErroSalvar } = useCodafComum();
  const {
    modalExcluirVisible,
    loadingExclusao,
    onClickExcluir,
    cancelarExclusao,
    confirmarExclusao,
  } = useExclusaoCodaf(excluirCodafConferencia, ROUTES.CODAF_CONFERENCIA);

  const {
    cursistas,
    setCursistas,
    cursistasSelecionadosIds,
    setCursistasSelecionadosIds,
    paginaAtualInscritos,
    setPaginaAtualInscritos,
    registrosPorPaginaInscritos,
    totalRegistrosInscritos,
    setTotalRegistrosInscritos,
    handleTableChangeInscritos,
  } = useTabelaInscritos<CursistaConferenciaDTO>();

  const [turmasFiltradas, setTurmasFiltradas] = useState<TurmaConferenciaOptionDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [codigoFormacaoCarregado, setCodigoFormacaoCarregado] = useState<number | null>(null);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [certificadoEmitido, setCertificadoEmitido] = useState(false);
  const [auditoriaDados, setAuditoriaDados] = useState<AuditoriaDTO>();
  const [drawerLoteAberto, setDrawerLoteAberto] = useState(false);

  const modoEdicao = !!id;
  const acoesEdicaoDesabilitadas = modoEdicao && !edicaoEExclusaoHabilitadas;

  const situacao = {
    iniciado: status === StatusCodafConferencia.INICIADO,
    aguardandoFinalizacao: status === StatusCodafConferencia.AGUARDANDO_FINALIZACAO,
    finalizado: status === StatusCodafConferencia.FINALIZADO,
  };

  const bloqueios = {
    campos: {
      secaoFormulario: {
        codigoFormacao: modoEdicao,
        turma: modoEdicao,
        camposPublicacao: situacao.finalizado || certificadoEmitido,
      },
      listaInscritos: situacao.finalizado || certificadoEmitido,
      informacoesAdicionais: (situacao.finalizado && ehAreaPromotora) || certificadoEmitido,
    },
    anexos: {
      areaPromotora: situacao.finalizado || certificadoEmitido,
    },
    botoes: {
      excluir: {
        visivel: modoEdicao,
        bloqueado: acoesEdicaoDesabilitadas ? false : !situacao.iniciado || certificadoEmitido,
      },
      salvar: {
        visivel:
          acoesEdicaoDesabilitadas ||
          ((!situacao.aguardandoFinalizacao ||
            (situacao.aguardandoFinalizacao && ehAreaPromotoraEAdmin)) &&
            !situacao.finalizado),
        bloqueado: acoesEdicaoDesabilitadas ? false : situacao.finalizado || certificadoEmitido,
      },
    },
  };

  const turmaId = Form.useWatch('turmaId', form);

  const situacaoExibida: StatusCodafConferencia =
    (status as StatusCodafConferencia) ?? StatusCodafConferencia.INICIADO;

  const quantidadeMinimaSelecionada = cursistasSelecionadosIds.length >= 1;

  React.useEffect(() => {
    const aplicarCamposFormulario = (dados: CodafConferenciaDetalheDTO) => {
      form.setFieldsValue({
        numeroHomologacao: dados.numeroHomologacao,
        nomeFormacao: dados.nomeFormacao,
        codigoFormacao: dados.codigoFormacao,
        turmaId: dados.propostaTurmaId,
        numeroComunicado: dados.numeroComunicado,
        dataComunicado: dados.dataComunicado ? dayjs(dados.dataComunicado) : null,
        paginaComunicadoDom: dados.paginaComunicadoDom,
        dataPublicacaoDom: dados.dataPublicacaoDom ? dayjs(dados.dataPublicacaoDom) : null,
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

    const carregarTurmas = async (dados: CodafConferenciaDetalheDTO) => {
      try {
        const turmasResponse = await obterDetalhesPropostaConferenciaComTurmasPorId(
          dados.propostaId,
        );
        if (turmasResponse.sucesso && turmasResponse.dados?.turmas?.length) {
          setTurmasFiltradas(
            turmasResponse.dados.turmas.map((t: any) => ({
              id: t.id,
              descricao: t.descricao || t.nome,
            })),
          );
          setCodigoFormacaoCarregado(dados.propostaId);
          setTurmaDisabled(false);
        } else {
          setTurmasFiltradas([]);
          setCodigoFormacaoCarregado(null);
          setTurmaDisabled(true);
        }
      } catch {
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
      }
    };

    const carregarDados = async () => {
      if (!id) return;
      setCarregando(true);

      try {
        const response = await obterCodafConferenciaPorId(Number(id));

        if (!response.sucesso || !response.dados) {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] ?? 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.CODAF_CONFERENCIA);
          return;
        }

        const dados = response.dados;
        setCertificadoEmitido(dados.certificadoEmitido ?? false);
        setRegistroId(dados.id);
        setAuditoriaDados({
          id: dados.id,
          criadoEm: dados.criadoEm,
          criadoPor: dados.criadoPor,
          criadoLogin: dados.criadoLogin,
          alteradoEm: dados.alteradoEm || '',
          alteradoPor: dados.alteradoPor || '',
          alteradoLogin: dados.alteradoLogin || '',
        });
        setStatus(dados.status);

        aplicarCamposFormulario(dados);
        await carregarTurmas(dados);
      } catch {
        notification.error({
          message: 'Erro',
          description: 'Erro ao carregar dados do registro',
        });
        navigate(ROUTES.CODAF_CONFERENCIA);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id, form, navigate]);

  const carregarDadosDosInscritosDaTurma = async () => {
    if (!turmaId) {
      setTotalRegistrosInscritos(0);
      setCursistas([]);
      setPaginaAtualInscritos(1);
      return;
    }

    setCarregando(true);
    try {
      const codafIdAtual = registroId ?? (id ? Number(id) : undefined);
      const resposta = await obterInscritosTurmaConferencia(
        turmaId,
        1,
        99999,
        codafIdAtual,
      );
      if (resposta.sucesso && resposta.dados) {
        const inscritosFormatados = resposta.dados.items.map((inscrito) => ({
          id: inscrito.id,
          nomeCursista: inscrito.nome,
          participou: inscrito.participou ?? null,
          rfOuCpf: inscrito.documento,
        }));
        setTotalRegistrosInscritos(resposta.dados.totalRegistros || 0);
        setPaginaAtualInscritos(1);
        setCursistas(inscritosFormatados);
      } else {
        setTotalRegistrosInscritos(0);
        setCursistas([]);
        notification.warning({
          message: 'Atenção',
          description: 'Nenhum inscrito confirmado encontrado para esta turma',
        });
      }
    } catch {
      setTotalRegistrosInscritos(0);
      setCursistas([]);
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar inscritos da turma',
      });
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    carregarDadosDosInscritosDaTurma();
  }, [turmaId]);

  const registrarDadosDesabilitado = modoEdicao || !quantidadeMinimaSelecionada;
  const editarDadosDesabilitado = !modoEdicao || !quantidadeMinimaSelecionada;

  const onClickRegistrarDados = () => {
    setDrawerLoteAberto(true);
  };

  const onClickEditarDados = () => {
    setDrawerLoteAberto(true);
  };

  const onConfirmarDadosLote = (dados: DadosLoteCursistas) => {
    setCursistas((prev) =>
      prev.map((cursista) =>
        cursistasSelecionadosIds.includes(cursista.id)
          ? {
              ...cursista,
              participou: dados.participou,
            }
          : cursista,
      ),
    );
    setDrawerLoteAberto(false);
    setCursistasSelecionadosIds([]);
  };

  const onChangeParticipou = useCallback(
    (cursistaId: number, valor: boolean) => {
      setCursistas((prev) =>
        prev.map((c) => (c.id === cursistaId ? { ...c, participou: valor } : c)),
      );
    },
    [setCursistas],
  );

  const colunasCursistas = criarColunasCodafNaoHomologado(
    paginaAtualInscritos,
    registrosPorPaginaInscritos,
    bloqueios.campos.listaInscritos,
    onChangeParticipou,
  );

  const rowSelection: TableRowSelection<CursistaConferenciaDTO> = {
    selectedRowKeys: cursistasSelecionadosIds,
    onChange: (selectedRowKeys) => {
      setCursistasSelecionadosIds(selectedRowKeys as number[]);
    },
    preserveSelectedRowKeys: true,
    getCheckboxProps: () => ({
      disabled: bloqueios.campos.listaInscritos,
    }),
  };

  const onChangeCodigoFormacao = () => {
    setCodigoFormacaoCarregado(null);
    setTurmasFiltradas([]);
    form.setFieldsValue({
      nomeFormacao: '',
      numeroHomologacao: '',
      turmaId: undefined,
    });
    setTurmaDisabled(true);
  };

  const onBlurCodigoFormacao = async (rawValue: string) => {
    const valor = rawValue.replaceAll(/\D/g, '');

    if (valor.length < 1) {
      setCodigoFormacaoCarregado(null);
      setTurmasFiltradas([]);
      setTurmaDisabled(true);
      return;
    }

    if (
      turmasFiltradas.length > 0 &&
      codigoFormacaoCarregado !== null &&
      Number(valor) === codigoFormacaoCarregado
    ) {
      return;
    }

    try {
      const response = await obterDetalhesPropostaConferenciaComTurmasPorId(Number(valor));
      setCodigoFormacaoCarregado(null);
      setTurmasFiltradas([]);
      form.setFieldsValue({
        nomeFormacao: '',
        numeroHomologacao: '',
        turmaId: undefined,
      });

      if (!response.sucesso) {
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.warning({
          message: 'Atenção',
          description: 'Erro ao buscar detalhes da formação',
        });
        return;
      }

      if (response.dados) {
        const dadosProposta = response.dados;
        if (
          dadosProposta.tipoFormacao !== undefined &&
          dadosProposta.tipoFormacao !== null &&
          dadosProposta.tipoFormacao !== TIPO_FORMACAO_CONFERENCIA
        ) {
          notification.warning({
            message: 'Atenção',
            description: 'A formação informada não pertence ao tipo Conferência.',
          });
          setTurmaDisabled(true);
          return;
        }

        if (
          dadosProposta.situacao !== undefined &&
          dadosProposta.situacao !== null &&
          dadosProposta.situacao !== SituacaoProposta.Publicada
        ) {
          notification.warning({
            message: 'Atenção',
            description: 'A formação informada deve estar com a situação Publicada.',
          });
          setTurmaDisabled(true);
          return;
        }

        form.setFieldsValue({
          nomeFormacao: dadosProposta.nomeFormacao,
          codigoFormacao: dadosProposta.id,
          numeroHomologacao: dadosProposta.numeroFormacao,
        });

        if (dadosProposta.turmas && dadosProposta.turmas.length > 0) {
          setTurmasFiltradas(
            dadosProposta.turmas.map((t: any) => ({
              id: t.id,
              descricao: t.descricao || t.nome,
              possuiCodafConferencia: !!t.possuiCodafConferencia,
            })),
          );
          setCodigoFormacaoCarregado(dadosProposta.id);
          setTurmaDisabled(false);
        } else {
          setTurmasFiltradas([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } else {
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.info({
          message: 'Informação',
          description: 'Formação de conferência publicada não encontrada',
        });
      }
    } catch {
      setTurmasFiltradas([]);
      setTurmaDisabled(true);
      notification.warning({
        message: 'Atenção',
        description: 'Erro ao buscar detalhes da formação',
      });
    }
  };

  const onSelectTurma = async (turmaIdSelecionada?: number) => {
    if (!turmaIdSelecionada) return;

    try {
      const possuiResponse = await verificarTurmaPossuiCodafConferencia(
        turmaIdSelecionada,
        registroId ?? undefined,
      );
      if (possuiResponse.sucesso && possuiResponse.dados) {
        form.setFieldsValue({ turmaId: undefined });
        setTurmasFiltradas((prev) =>
          prev.map((t) =>
            t.id === turmaIdSelecionada ? { ...t, possuiCodafConferencia: true } : t,
          ),
        );
        notification.warning({
          message: 'Atenção',
          description: 'Esta turma já está vinculada a um CODAF Formação de Conferência.',
        });
      }
    } catch {
      // ignora falha de checagem auxiliar
    }
  };

  const fazerUploadAnexoValidado = async (formData: FormData, configuracaoHeader: any) => {
    const arquivo = formData.get('arquivo') as File | null;
    if (arquivo && !validarArquivoPdf(arquivo)) {
      notification.error({
        message: 'Formato inválido',
        description: 'Só é permitido inserir arquivos no formato PDF.',
      });
      return {
        sucesso: false,
        mensagens: ['Só é permitido inserir arquivos no formato PDF.'],
      } as any;
    }

    return fazerUploadAnexoCodafConferencia(formData, configuracaoHeader);
  };

  const recarregarAnexos = async (registroIdAtual: number) => {
    const detalhes = await obterCodafConferenciaPorId(registroIdAtual);
    if (detalhes.sucesso && detalhes.dados?.anexos) {
      form.setFieldsValue({ anexos: mapearAnexosParaFormulario(detalhes.dados.anexos) });
    }
  };

  const montarPayloadSalvar = (values: any): CodafConferenciaCadastroDTO => {
    const anexosMapeados =
      values.anexos?.map((arquivo: any) => ({
        arquivoCodigo: arquivo.response?.codigo ?? arquivo.arquivoCodigo,
        nomeArquivo: arquivo.name || arquivo.nomeArquivo,
        tipoAnexoId: 3,
      })) ?? [];

    return {
      propostaId: Number(values.codigoFormacao) || 0,
      propostaTurmaId: Number(values.turmaId) || 0,
      numeroComunicado: values.numeroComunicado ? Number(values.numeroComunicado) : null,
      dataComunicado: values.dataComunicado
        ? dayjs(values.dataComunicado).format('YYYY-MM-DD')
        : null,
      paginaComunicadoDom: values.paginaComunicadoDom ? Number(values.paginaComunicadoDom) : null,
      dataPublicacaoDom: values.dataPublicacaoDom
        ? dayjs(values.dataPublicacaoDom).format('YYYY-MM-DD')
        : null,
      codigoCursoEol: values.codigoCursoEol ? Number(values.codigoCursoEol) : null,
      codigoNivel: values.codigoNivel ? Number(values.codigoNivel) : null,
      observacao: values.observacao || '',
      inscritos: cursistas.map((cursista) => ({
        inscricaoId: cursista.id,
        participou: cursista.participou ?? null,
      })),
      anexos: anexosMapeados,
    };
  };

  const tratarRespostaSalvar = (response: any) => {
    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description: modoEdicao
          ? 'Registro atualizado com sucesso!'
          : 'Registro salvo com sucesso!',
      });

      navigate(ROUTES.CODAF_CONFERENCIA, { state: location.state });
    } else {
      const mensagensErro = response.mensagens ?? [];
      const mensagemPadrao = modoEdicao
        ? 'Erro ao atualizar o registro'
        : 'Erro ao salvar o registro';
      const mensagemDetalhada =
        mensagensErro.length > 0 ? mensagensErro.join(', ') : mensagemPadrao;
      notification.error({ message: 'Erro ao salvar', description: mensagemDetalhada });
    }
  };

  const onClickSalvar = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setCarregando(true);

      const dados = montarPayloadSalvar(values);

      const response = modoEdicao
        ? await atualizarCodafConferencia(Number(id), dados)
        : await criarCodafConferencia(dados);

      tratarRespostaSalvar(response);

      if (response.sucesso) {
        const registroIdAtual = registroId ?? response.dados?.id;

        if (registroIdAtual) {
          await recarregarAnexos(Number(registroIdAtual));
        }
      }
    } catch (error: any) {
      exibirErroSalvar(error, modoEdicao);
    } finally {
      setCarregando(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({
      navigate,
      route: ROUTES.CODAF_CONFERENCIA,
      paramsRoute: { state: location.state },
    });
  };

  return (
    <Col>
      <HeaderPage title='CODAF Formação de Conferência'>
        <Col span={24}>
          <BotoesAcaoCodaf
            bloqueiosBotoes={bloqueios.botoes}
            loading={carregando}
            onClickVoltar={onClickCancelar}
            onClickExcluir={acoesEdicaoDesabilitadas ? () => {} : onClickExcluir}
            onClickCancelar={onClickCancelar}
            onClickSalvar={acoesEdicaoDesabilitadas ? () => {} : () => onClickSalvar()}
            tooltipExcluir={acoesEdicaoDesabilitadas ? TOOLTIP_NAO_IMPLEMENTADO : undefined}
            tooltipSalvar={acoesEdicaoDesabilitadas ? TOOLTIP_NAO_IMPLEMENTADO : undefined}
          />
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <Badge.Ribbon
          data-testid='tag-situacao-codaf'
          text={SituacaoCodafConferenciaTagDisplay[situacaoExibida]}
        >
          <CardContent>
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <div style={{ paddingBottom: '24px' }}>
                  Aqui você cria ou edita um CODAF para formação do tipo Conferência.
                </div>
              </Col>
            </Row>
            <SecaoFormularioConferencia
              onChangeCodigoFormacao={onChangeCodigoFormacao}
              onBlurCodigoFormacao={onBlurCodigoFormacao}
              onSelectTurma={onSelectTurma}
              turmasFiltradas={turmasFiltradas}
              turmaDisabled={turmaDisabled}
              camposBloqueados={bloqueios.campos.secaoFormulario}
            />
            <SecaoListaInscritos
              colunasCursistas={colunasCursistas}
              cursistas={cursistas}
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
              modoEdicao={modoEdicao}
            />
            <SecaoAnexos
              form={form}
              podeGerenciarAnexos={ehAreaPromotora || ehAreaPromotoraEAdmin}
              onDownloadAnexo={onDownloadAnexo}
              fazerUploadAnexoCodaf={fazerUploadAnexoValidado}
              obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
              bloqueado={bloqueios.anexos.areaPromotora}
            />
            <SecaoInformacoesAdicionais disabled={bloqueios.campos.informacoesAdicionais} />
            <Auditoria dados={auditoriaDados} />
          </CardContent>
        </Badge.Ribbon>
      </Form>
      <DrawerEdicaoLoteCursistas
        open={drawerLoteAberto}
        modo='registrar'
        loading={carregando}
        onClose={() => setDrawerLoteAberto(false)}
        onConfirmar={onConfirmarDadosLote}
      />
      <ModalExcluir
        visible={modalExcluirVisible}
        onCancel={cancelarExclusao}
        onConfirm={() => confirmarExclusao(registroId)}
        loading={loadingExclusao}
      />
    </Col>
  );
};

export default CadastroCodafConferencia;
