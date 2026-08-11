import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SecaoListaInscritos } from './componentes/secao-lista-inscritos';
import { SecaoFormulario } from './componentes/secao-formulario';
import { TableRowSelection } from 'antd/lib/table/interface';

dayjs.locale('pt-br');
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
  baixarModeloTermoResponsabilidade,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
} from '~/core/services/codaf-nao-homologado-service';
import { autocompletarFormacao, obterDetalhesPropostaComTurmasPorId, PropostaAutocompletarDTO, PropostaTurmaDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { downloadBlob } from '~/core/utils/functions';
import { mapearAnexosParaFormulario } from '~/pages/formacoes/codaf/shared/utils/mapear-anexos';
import {
  atualizarCodafNaoHomologado,
  CodafNaoHomologadoDetalheDTO,
  criarCodafNaoHomologado,
  excluirCodafNaoHomologado,
  obterCodafNaoHomologadoPorId,
  obterInscritosTurma,
} from '~/core/services/codaf-nao-homologado-service';
import ModalExcluir from '../../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir';
import { BannerDownloadTermo } from '../../lista-presenca-codaf/cadastro/componentes/banner-download-termo';
import { SecaoAnexos } from '../../lista-presenca-codaf/cadastro/componentes/secao-anexos';
import { DadosLoteCursistas, DrawerEdicaoLoteCursistas } from './componentes/drawer-edicao-lote-cursistas';

interface CursistaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
  participou: boolean | null;
}


const CadastroCodafFormacoesNaoHomologadas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);
  const [loading, setLoading] = useState(false);
  const [cursistas, setCursistas] = useState<CursistaDTO[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [cursistasSelecionadosIds, setCursistasSelecionadosIds] = useState<number[]>([]);

  const [drawerLoteAberto, setDrawerLoteAberto] = useState(false);
  const [drawerLoteModo, setDrawerLoteModo] = useState<'registrar' | 'editar'>('registrar');

  const cursistasSelecionados = cursistas.filter((c) => cursistasSelecionadosIds.includes(c.id));

  const algumSelecionadoComDados = cursistasSelecionados.some(
    (c) => c.participou !== null && c.participou !== undefined,
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
            participou: dados.participou,
          }
        : cursista,
    );

    const sucesso = await onClickSalvar(novaListaCursistas);

    if (sucesso) {
      setDrawerLoteAberto(false);
      setCursistasSelecionadosIds([]);
    }
  };

  const [turmasFiltradas, setTurmasFiltradas] = useState<PropostaTurmaDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [formValido, setFormValido] = useState(false);
  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [paginaAtualInscritos, setPaginaAtualInscritos] = useState(1);
  const [totalRegistrosInscritos, setTotalRegistrosInscritos] = useState(0);
  const [registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos] = useState(10);
  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [todasTurmasPossuemLista, setTodasTurmasPossuemLista] = useState(false);
  const [retificacoes, setRetificacoes] = useState<number[]>([1]);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const formOriginal = React.useRef<any>(null);
  const cursistasOriginais = React.useRef<CursistaDTO[]>([]);
  const situacoes = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando Finalização' },
    { id: 3, descricao: 'Finalizado' },
  ];

  const modoEdicao = !!id;

  const perfil = {
    df: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF],

    emforpef: perfilSelecionado === 'EMFORPEF',

    admin: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF],

    cursista: perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
  };

  const ehAreaPromotora = !perfil.cursista && !perfil.admin;

  const ehAreaPromotoraEAdmin = perfil.df || perfil.emforpef || perfil.admin;

  const situacao = {
    iniciado: status === 1,

    aguardandoFinalizacao: status === 2,

    finalizado: status === 3,
  };

  const bloqueios = {
    campos: {
      secaoFormulario: {
        numeroHomologacao: situacao.finalizado,
        turma: situacao.finalizado,
      },

      listaInscritos: situacao.finalizado,

      informacoesAdicionais: situacao.finalizado && ehAreaPromotora,
    },

    anexos: {
      areaPromotora: situacao.finalizado && !perfil.cursista && !perfil.admin,
    },

    botoes: {
      excluir: {
        visivel: modoEdicao && situacao.iniciado,

        bloqueado: situacao.finalizado,
      },

      salvar: {
        visivel:
          (!situacao.aguardandoFinalizacao ||
            (situacao.aguardandoFinalizacao && ehAreaPromotoraEAdmin)) &&
          !situacao.finalizado,

        bloqueado: situacao.finalizado,
      },
    },
  };

  const numeroHomologacao = Form.useWatch('numeroHomologacao', form);
  const nomeFormacao = Form.useWatch('nomeFormacao', form);
  const codigoFormacao = Form.useWatch('codigoFormacao', form);
  const turmaId = Form.useWatch('turmaId', form);

  React.useEffect(() => {
    const camposBasicosPreenchidos = numeroHomologacao && nomeFormacao && codigoFormacao && turmaId;

    const todosPreenchidos = camposBasicosPreenchidos;

    setFormValido(!!todosPreenchidos);
  }, [numeroHomologacao, nomeFormacao, codigoFormacao, turmaId, ehAreaPromotora]);

  React.useEffect(() => {
    const aplicarCamposFormulario = (dados: CodafNaoHomologadoDetalheDTO) => {
      form.setFieldsValue({
        numeroHomologacao: dados.numeroHomologacao,
        nomeFormacao: dados.nomeFormacao,
        codigoFormacao: dados.codigoFormacao,
        turmaId: dados.propostaTurmaId,
        observacao: dados.observacao || '',
      });

      if (dados.anexos && dados.anexos.length > 0) {
        form.setFieldsValue({
          anexos: mapearAnexosParaFormulario(dados.anexos),
        });
      }
    };

    const carregarTurmas = async (dados: CodafNaoHomologadoDetalheDTO) => {
      try {
        const turmasResponse = await obterTurmasInscricao(dados.propostaId);
        if (!turmasResponse.sucesso || !turmasResponse.dados) return;

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
        const response = await obterCodafNaoHomologadoPorId(Number(id));

        if (!response.sucesso || !response.dados) {
          notification.error({
            message: 'Erro',
            description: response.mensagens?.[0] ?? 'Erro ao carregar dados do registro',
          });
          navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
          return;
        }

        const dados = response.dados;
        setRegistroId(dados.id);
        setStatus(dados.status);

        aplicarCamposFormulario(dados);

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
        navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
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
          participou: inscrito.participou ?? null,
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

  const handleTableChangeInscritos = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPaginaInscritos) {
      setRegistrosPorPaginaInscritos(pagination.pageSize);
    }
    setPaginaAtualInscritos(pagination.current);
  };

  const colunasCursistas: ColumnsType<CursistaDTO> = [
    {
      key: 'indice',
      title: ' ',
      width: 60,
      align: 'center',
      render: (_text: any, _record: CursistaDTO, index: number) => {
        return (paginaAtualInscritos - 1) * registrosPorPaginaInscritos + index + 1;
      },
    },
    {
      key: 'rfOuCpf',
      title: 'Funcional (RF) ou CPF',
      dataIndex: 'rfOuCpf',
      width: 180,
    },
    {
      key: 'nomeCursista',
      title: 'Nome do Cursista',
      dataIndex: 'nomeCursista',
      ellipsis: true,
    },
    {
      key: 'participou',
      title: 'Participou',
      dataIndex: 'participou',
      width: 480,
      render: (participou: boolean | null, record: CursistaDTO) => (
        <Select
          disabled={bloqueios.campos.listaInscritos}
          value={participou}
          placeholder='Selecione'
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: true },
            { label: 'Não', value: false },
          ]}
          onChange={(novoValor) => {
            setCursistas((prevCursistas) =>
              prevCursistas.map((cursista) =>
                cursista.id === record.id
                  ? { ...cursista, participou: novoValor }
                  : cursista
              )
            );
          }}
        />
      ),
    },
  ];

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

  const onChangeCodigoFormacao = () => {
    setTurmasFiltradas([]);
    setTurmaDisabled(true);
  }

  const onBlurCodigoFormacao = async (_value: string) => {
    const valor = _value.replace(/\D/g, '');

    if (valor.length < 1) {
      setTurmasFiltradas([]);
      setTurmaDisabled(true);
      return;
    }

    try {
        const response = await obterDetalhesPropostaComTurmasPorId(Number(valor), false);
        if (response.sucesso && response.dados) {
            form.setFieldsValue({
                nomeFormacao: response.dados.nomeFormacao,
                codigoFormacao: response.dados.id,
                numeroHomologacao: response.dados.numeroFormacao,
            });

            if (response.dados.turmas && response.dados.turmas.length > 0) {
                setTurmasFiltradas(response.dados.turmas);
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
                description: 'Formação não encontrada',
            });
            form.setFieldsValue({
                nomeFormacao: '',
                numeroHomologacao: '',
                turmaId: undefined,
            });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmasFiltradas([]);
        setTurmaDisabled(true);
        notification.warning({
            message: 'Atenção',
            description: 'Erro ao buscar detalhes da formação',
        });
        form.setFieldsValue({
            nomeFormacao: '',
            numeroHomologacao: '',
            turmaId: undefined,
        });
      }
  };

  const tratarRespostaSalvar = (response: any) => {
    if (response.sucesso) {
      formOriginal.current = JSON.parse(JSON.stringify(form.getFieldsValue()));
      cursistasOriginais.current = JSON.parse(JSON.stringify(cursistas));
      notification.success({
        message: 'Sucesso',
        description: modoEdicao
          ? 'Registro atualizado com sucesso!'
          : 'Registro salvo com sucesso!',
      });
      if (!id) {
        navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
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
    const detalhes = await obterCodafNaoHomologadoPorId(registroIdAtual);
    if (detalhes.sucesso && detalhes.dados?.anexos) {
      form.setFieldsValue({ anexos: mapearAnexosParaFormulario(detalhes.dados.anexos) });
    }
  };

  const montarPayloadSalvar = (values: any, inscritosOverride?: CursistaDTO[]) => {
    const anexosMapeados =
      values.anexos?.map((arquivo: any) => ({
        arquivoCodigo: arquivo.response?.codigo ?? arquivo.arquivoCodigo,
        nomeArquivo: arquivo.name || arquivo.nomeArquivo,
        tipoAnexoId: 3,
      })) ?? [];

    const inscritosBase = Array.isArray(inscritosOverride) ? inscritosOverride : cursistas;

    return {
      propostaId: values.codigoFormacao || 0,
      propostaTurmaId: values.turmaId || 0,
      observacao: values.observacao || '',
      inscritos: inscritosBase.map((cursista) => ({
        inscricaoId: cursista.id,
        participou: cursista.participou ?? null,
      })),
      anexos: anexosMapeados,
    };
  };

  const exibirErroSalvar = (error: any) => {
    const mensagemPadraoErro = modoEdicao
      ? 'Erro ao atualizar o registro'
      : 'Erro ao salvar o registro';
    const mensagemErro =
      error?.response?.data?.erros?.[0] ??
      error?.response?.data?.mensagens?.[0] ??
      error?.message ??
      mensagemPadraoErro;

    notification.error({ message: 'Erro', description: mensagemErro });
  };

  const onClickSalvar = async (inscritosOverride?: CursistaDTO[]): Promise<boolean> => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const dados = montarPayloadSalvar(values, inscritosOverride);

      const response = modoEdicao
        ? await atualizarCodafNaoHomologado(registroId ?? 0, dados)
        : await criarCodafNaoHomologado(dados);

      tratarRespostaSalvar(response);

      if (response.sucesso) {
        const registroIdAtual = registroId ?? response.dados?.id;

        if (registroIdAtual) {
          await recarregarAnexos(Number(registroIdAtual));
        }

        if (inscritosOverride) {
          setCursistas(inscritosOverride);
        }

        return true;
      }

      return false;
    } catch (error: any) {
      exibirErroSalvar(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onClickCancelar = () => {
    onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO });
  };

  const onClickExcluir = () => {
    setModalExcluirVisible(true);
  };

  const confirmarExclusao = async () => {
    try {
      if (!registroId) {
        notification.warning({
          message: 'Atenção',
          description: 'Registro não encontrado',
        });
        setModalExcluirVisible(false);
        return;
      }

      setLoading(true);
      setModalExcluirVisible(false);

      const response = await excluirCodafNaoHomologado(registroId);

      if (response.status === 204) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro excluído com sucesso!',
        });
        navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO);
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
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      const mensagemErro =
        error?.response?.data?.erros?.[0] ||
        error?.response?.data?.mensagens?.[0] ||
        error?.message ||
        'Erro ao excluir o registro';

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirVisible(false);
  };

  const onBaixarModelo = async () => {
    try {
      setLoading(true);
      const response = await baixarModeloTermoResponsabilidade();

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const contentType = response.headers['content-type'];
        let fileName = 'Modelo_Termo_Responsabilidade';

        if (contentType?.includes('pdf')) {
          fileName += '.pdf';
        } else if (contentType?.includes('wordprocessingml') || contentType?.includes('msword')) {
          fileName += '.docx';
        } else {
          fileName += '.pdf';
        }

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        downloadBlob(response.data, fileName);

        notification.success({
          message: 'Sucesso',
          description: 'Modelo baixado com sucesso!',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao baixar modelo do termo de responsabilidade',
        });
      }
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao baixar modelo do termo de responsabilidade',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDownloadAnexo = async (arquivo: any) => {
    try {
      if (arquivo.urlDownload) {
        window.open(arquivo.urlDownload, '_blank');
        return;
      }

      const codigoArquivo = arquivo.xhr || arquivo.arquivoCodigo || arquivo.response;

      if (!codigoArquivo) {
        notification.error({
          message: 'Erro',
          description: 'Código do arquivo não encontrado',
        });
        return;
      }

      const response = await obterAnexoCodafParaDownload(codigoArquivo);

      if (response.status === 200) {
        downloadBlob(response.data, arquivo.name);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao fazer download do arquivo',
        });
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      notification.error({
        message: 'Erro',
        description: 'Erro ao fazer download do arquivo',
      });
    }
  };

  return (
    <Col>
      <HeaderPage title='CODAF não homologados'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() =>
                  onClickVoltar({ navigate, route: ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO })
                }
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            {bloqueios.botoes.excluir.visivel && (
              <Col>
                <Button
                  type='default'
                  disabled={bloqueios.botoes.excluir.bloqueado}
                  onClick={onClickExcluir}
                  id={CF_BUTTON_EXCLUIR}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Excluir
                </Button>
              </Col>
            )}
            {bloqueios.botoes.salvar.visivel && (
              <Col>
                <Button
                  disabled={bloqueios.botoes.salvar.bloqueado}
                  type='default'
                  onClick={onClickCancelar}
                  id={CF_BUTTON_CANCELAR}
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Cancelar
                </Button>
              </Col>
            )}
            {bloqueios.botoes.salvar.visivel && (
              <Col>
                <Button
                  disabled={bloqueios.botoes.salvar.bloqueado}
                  type='primary'
                  onClick={() => onClickSalvar()}
                  loading={loading}
                  id={CF_BUTTON_SALVAR}
                  style={{ fontWeight: 700 }}
                >
                  Salvar
                </Button>
              </Col>
            )}
          </Row>
        </Col>
      </HeaderPage>
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
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
                  Aqui você cria um novo CODAF não homologado. Preencha todas as informações antes
                  de salvar as informações.
                </div>
              </div>
            </Col>
          </Row>

          <SecaoFormulario
            opcoesFormacao={opcoesFormacao}
            onChangeCodigoFormacao={onChangeCodigoFormacao}
            onBlurCodigoFormacao={onBlurCodigoFormacao}
            loadingAutocomplete={loadingAutocomplete}
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
          />
          <DrawerEdicaoLoteCursistas
            open={drawerLoteAberto}
            modo={drawerLoteModo}
            quantidadeSelecionados={cursistasSelecionadosIds.length}
            loading={false}
            onClose={() => setDrawerLoteAberto(false)}
            onConfirmar={onConfirmarDadosLote}
          />
          <SecaoAnexos
            form={form}
            podeGerenciarAnexos={!perfil.cursista}
            onDownloadAnexo={onDownloadAnexo}
            fazerUploadAnexoCodaf={fazerUploadAnexoCodaf}
            obterAnexoCodafParaDownload={obterAnexoCodafParaDownload}
            bloqueado={bloqueios.anexos.areaPromotora}
          />

          <BannerDownloadTermo onBaixarModelo={onBaixarModelo} />

          <Row gutter={[16, 8]} style={{ marginTop: 32 }}>
            <Col span={24}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '100%',
                  color: '#42474A',
                  marginBottom: 8,
                }}
              >
                Informações adicionais
              </div>
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
                  disabled={bloqueios.campos.informacoesAdicionais}
                />
              </Form.Item>
            </Col>
          </Row>
        </CardContent>
      </Form>

      <ModalExcluir
        visible={modalExcluirVisible}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        loading={loading}
      />
    </Col>
  );
};

export default CadastroCodafFormacoesNaoHomologadas;
