import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  MenuProps,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import { notification } from '~/components/lib/notification';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
} from '~/core/constants/ids/input';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import {
  baixarRelatorioCodaf,
  CodafListaPresencaDTO,
  obterListaPresencaCodaf,
  emitirCertificadosCodaf,
  imprimirRelatorioCodaf,
  finalizarCodaf,
} from '~/core/services/codaf-lista-presenca-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { downloadBlob } from '~/core/utils/functions';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { TipoCodaf } from '~/core/enum/tipo-codaf';
import { criarColunasBaseListagemCodaf } from '../shared/componentes/codaf-colunas-factory';
import { HeaderListagemCodaf } from '../shared/componentes/header-listagem-codaf';
import { ModalAvisoNovoRegistroCodaf } from '../shared/componentes/modal-aviso-novo-registro-codaf';

const ListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesHomologadas);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [dados, setDados] = useState<CodafListaPresencaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  const [turmasAPI, setTurmasAPI] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [_update, forceUpdate] = useState(0);

  const [modalFinalizarVisible, setModalFinalizarVisible] = useState(false);
  const [registroParaFinalizar, setRegistroParaFinalizar] = useState<CodafListaPresencaDTO | null>(
    null,
  );
  const [finalizandoCodaf, setFinalizandoCodaf] = useState(false);

  const ehPerfilAdminDf = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF];
  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const ocultarColunas = ehPerfilDF || ehPerfilEMFORPEF;

  const situacoes = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando DF' },
    { id: 3, descricao: 'Devolvido pelo DF' },
    { id: 4, descricao: 'Finalizado' },
  ];

  const LOCAL_STORAGE_KEY = 'codaf_emitir_certificados_clicked';
  const EOL_STORAGE_KEY = 'eol_txt_generated';

  const location = useLocation();

  interface IStateLocationListaPresenca {
    propostaSelecionada?: PropostaAutocompletarDTO;
    formValues?: Record<string, any>;
    paginaAtual?: number;
    registrosPorPagina?: number;
    filtroAplicado?: boolean;
  }

  React.useEffect(() => {
    const resolverTurmasDaProposta = async (propostaId?: number) => {
      if (!propostaId) return { turmas: [] as RetornoListagemDTO[], desabilitado: true };

      try {
        const { sucesso, dados } = await obterTurmasInscricao(propostaId);
        const possuiTurmas = sucesso && (dados?.length ?? 0) > 0;
        
        return {
          turmas: possuiTurmas ? dados! : [],
          desabilitado: !possuiTurmas
        };
      } catch (e) {
        console.error(e);
        return { turmas: [] as RetornoListagemDTO[], desabilitado: true };
      }
    };

    const restaurarEstadoLocal = async (estado: IStateLocationListaPresenca) => {
      const proposta = estado.propostaSelecionada;
      
      if (proposta) {
        setPropostaSelecionada(proposta);
        setOpcoesFormacao([proposta]); 
      } else {
        setOpcoesFormacao([] as PropostaAutocompletarDTO[]);
      }

      const { turmas, desabilitado } = await resolverTurmasDaProposta(proposta?.propostaId);
      
      setTurmasAPI(turmas);
      setTurmaDisabled(desabilitado);

      if (estado.formValues) form.setFieldsValue(estado.formValues);
      if (estado.paginaAtual) setPaginaAtual(estado.paginaAtual);
      if (estado.registrosPorPagina) setRegistrosPorPagina(estado.registrosPorPagina);
      if (estado.filtroAplicado) setFiltroAplicado(estado.filtroAplicado);

      buscarDados(estado.paginaAtual ?? 1);
    };

    const inicializarArvoreDeEstado = async () => {
      const state = location.state as IStateLocationListaPresenca | null;

      if (state) {
        await restaurarEstadoLocal(state);
      } else {
        buscarDados(1);
      }
    };

    inicializarArvoreDeEstado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStateToSave = () => ({
    formValues: form.getFieldsValue(),
    paginaAtual,
    registrosPorPagina,
    filtroAplicado,
    propostaSelecionada,
  });

  const getEmitidos = (): number[] => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const saveEmitido = (id: number) => {
    const emitidos = getEmitidos();
    if (!emitidos.includes(id)) {
      emitidos.push(id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emitidos));
    }
  };

  const getGeneratedMap = (): Record<number, boolean> => {
    return JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}');
  };

  const setGenerated = (id: number) => {
    const map = getGeneratedMap();
    map[id] = true;
    localStorage.setItem(EOL_STORAGE_KEY, JSON.stringify(map));
  };

  const onClickEmitirCertificado = async (record: CodafListaPresencaDTO) => {
    try {
      setLoading(true);
      saveEmitido(record.id);

      const response = await emitirCertificadosCodaf(record.id, TipoCodaf.ListaPresenca);
      forceUpdate((x) => x + 1);
      if (response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description:
            'O certificado está sendo emitido, volte mais tarde para acompanhar a atualização.',
        });

        buscarDados(paginaAtual);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao emitir certificados',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao emitir certificados',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTxtFile = (content: string, filename: string) => {
    const formattedContent = content.replace(/\|00\|HOM/g, '||HOM');
    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onClickExportarListaInscritos = async (record: CodafListaPresencaDTO) => {
    try {
      const response = await baixarRelatorioCodaf(record.id);
      if (response.sucesso && response.dados) {
        const filename = `HOM${record.numeroHomologacao}${record.id}.txt`;
        downloadTxtFile(response.dados, filename);
        setGenerated(record.id);
        notification.success({
          message: 'Sucesso',
          description: `O arquivo ${filename} foi gerado com sucesso!`,
        });
        buscarDados(paginaAtual);
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao exportar lista de inscritos',
      });
    }
  };

  const onClickBaixarRelatorioCodaf = async (record: CodafListaPresencaDTO) => {
    try {
      setLoading(true);
      let fileName = `CODAF_${record.numeroHomologacao}_${record.nomeTurma.replace(' ', '_')}.xlsx`;
      const response = await imprimirRelatorioCodaf(record.id);

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        downloadBlob(response.data, fileName);

        notification.success({
          message: 'Sucesso',
          description: `${fileName}. Arquivo baixado com sucesso`,
        });

        buscarDados();
      } else {
        notification.error({
          message: 'Erro',
          description: `${fileName}. Não conseguimos gerar o seu arquivo. Tente novamente.`,
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: '${fileName}. Não conseguimos gerar o seu arquivo. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarCodaf = (record: CodafListaPresencaDTO) => {
    setRegistroParaFinalizar(record);
    setModalFinalizarVisible(true);
  };

  const onCancelarFinalizarCodaf = () => {
    setModalFinalizarVisible(false);
    setRegistroParaFinalizar(null);
  };

  const onConfirmarFinalizarCodaf = async () => {
    if (!registroParaFinalizar) return;

    try {
      setFinalizandoCodaf(true);
      const response = await finalizarCodaf(registroParaFinalizar.id);

      if (response.status === 204) {
        notification.success({
          message: 'Sucesso',
          description: 'O registro foi finalizado.',
        });
        setModalFinalizarVisible(false);
        setRegistroParaFinalizar(null);
        buscarDados(paginaAtual);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao finalizar CODAF.',
        });
      }
    } catch (error: any) {
      // Erro 400 do backend traz a mensagem de negócio em error.response.data
      const mensagemErro =
        error?.response?.data?.mensagens?.[0] ??
        error?.response?.data?.MensagensErro?.[0] ??
        'Não conseguimos finalizar seu registro CODAF. Tente novamente.';

      notification.error({
        message: 'Erro',
        description: mensagemErro,
      });
    } finally {
      setFinalizandoCodaf(false);
    }
  };

  const getMenuAcoes = (record: CodafListaPresencaDTO): MenuProps => {
    const hasCodigoCursoEol = record.codigoCursoEol != null;
    const isAguardandoDF = record.status === 2;
    const isFinalizado = record.status === 4;
    const isCertificacaoConcluida = record.statusCertificacaoTurma === 4;
    const podeGerarComoComum = isAguardandoDF && hasCodigoCursoEol;
    const podeGerarComoAdmin = isFinalizado && ehPerfilAdminDf;
    const podeGerarTxtEol = (podeGerarComoComum || podeGerarComoAdmin) && record.possuiAprovacoes;

    const getTooltipMessage = () => {
      if (podeGerarTxtEol) {
        return 'Clique para gerar TXT EOL';
      }
      if (!record.possuiAprovacoes) {
        return 'Este CODAF não possui aprovações.';
      }
      if (isAguardandoDF && !hasCodigoCursoEol) {
        return 'Informe o valor de Cód. curso EOL para gerar o arquivo.';
      }
      return 'Função ativa apenas para a situação Aguardando DF com valor de Cod. Curso EOL informado';
    };

    const items = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        disabled: !podeGerarTxtEol,
        label: !podeGerarTxtEol ? (
          <span style={{ display: 'block' }}>
            Gerar TXT EOL &nbsp;
            <Tooltip title={getTooltipMessage()}>
              <QuestionCircleOutlined
                style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }}
              />
            </Tooltip>
          </span>
        ) : (
          <Tooltip title='Clique para gerar TXT EOL'>
            <span style={{ display: 'block' }}>Gerar TXT EOL</span>
          </Tooltip>
        ),
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
          if (podeGerarTxtEol) {
            onClickExportarListaInscritos(record);
          }
        },
      });
    }

    items.push({
      key: 'baixar-relatorio-codaf',
      disabled: !isCertificacaoConcluida || !record.possuiAprovacoes,
      label:
        isCertificacaoConcluida && record.possuiAprovacoes ? (
          <Tooltip title='Clique para exportar arquivo CODAF desta turma'>
            <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
          </Tooltip>
        ) : (
          <span style={{ display: 'block' }}>
            Baixar Relatório CODAF &nbsp;
            <Tooltip
              title={
                record.possuiAprovacoes
                  ? 'Gere os certificados para baixar o relatório CODAF.'
                  : 'Este CODAF não possui aprovações.'
              }
            >
              <QuestionCircleOutlined
                style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }}
              />
            </Tooltip>
          </span>
        ),
      onClick: (e: any) => {
        e.domEvent.stopPropagation();
        if (isCertificacaoConcluida && record.possuiAprovacoes) {
          onClickBaixarRelatorioCodaf(record);
        }
      },
    });

    if (!record.possuiAprovacoes && !isFinalizado && ehPerfilAdminDf) {
      items.push({
        key: 'finalizar',
        label: <span style={{ display: 'block' }}>Finalizar</span>,
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
          handleFinalizarCodaf(record);
        },
      });
    }

    return { items };
  };

  const obterSituacaoTexto = (status: number): string => {
    const situacao = situacoes.find((s) => s.id === status);
    return situacao?.descricao || 'Desconhecido';
  };

  const getCertificadoButtonState = (record: CodafListaPresencaDTO) => {
    if (!record.possuiAprovacoes) {
      return { text: 'Sem aprovações', disabled: true };
    }

    const status = record.statusCertificacaoTurma;

    if (status === 0) {
      return { text: 'Sem certificado', disabled: true };
    }

    if (status === 1) {
      return { text: 'Não emitidos', disabled: true };
    }

    if (status === 2) {
      return { text: 'Emitir certificados', disabled: false };
    }

    if (status === 3) {
      return { text: 'Emitindo certificado', disabled: true };
    }

    if (status === 4) {
      return { text: 'Certificados emitidos', disabled: true };
    }

    return { text: '—', disabled: true };
  };

  const colunasBase = criarColunasBaseListagemCodaf<CodafListaPresencaDTO>(
    ocultarColunas,
    obterSituacaoTexto,
  );

  const colunasAdicionais: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'certificado',
      title: (
        <span>
          Certificado{' '}
          <Tooltip title='Ao emitir certificado, a conclusão do curso é gerada tanto para cursistas quanto para regentes.'>
            <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
          </Tooltip>
        </span>
      ),
      width: 220,
      render: (_: any, record: CodafListaPresencaDTO) => {
        const { text, disabled } = getCertificadoButtonState(record);

        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            loading={loading && text === 'Estamos emitindo certificado'}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onClickEmitirCertificado(record);
            }}
            style={{
              width: '100%',
              borderColor: !disabled ? '#ff6b35' : '#ccc',
              color: !disabled ? '#ff6b35' : '#999',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {text}
          </Button>
        );
      },
    },
  ];

  const colunaAcoes: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_: any, record: CodafListaPresencaDTO) => (
        <Dropdown
          menu={getMenuAcoes(record)}
          trigger={['click']}
          placement='bottomRight'
          dropdownRender={(menu) => (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              {React.cloneElement(menu as React.ReactElement, {
                style: { boxShadow: 'none' },
              })}
            </div>
          )}
        >
          <Button
            type='default'
            icon={<BsThreeDotsVertical />}
            style={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const columns = ocultarColunas
    ? [...colunasBase, ...colunaAcoes]
    : [...colunasBase, ...colunasAdicionais, ...colunaAcoes];

  const buscarDados = async (pagina = 1) => {
    setLoading(true);
    try {
      const dataEnvio = form.getFieldValue('dataEnvio');
      const dataEnvioDf = dataEnvio ? dayjs(dataEnvio).format('YYYY-MM-DD') : undefined;

      const numeroHomologacao = form.getFieldValue('numeroHomologacao');

      const filtros = {
        NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
        CodigoFormacao: form.getFieldValue('codigoFormacao') || undefined,
        NumeroHomologacao: numeroHomologacao ? Number(numeroHomologacao) : undefined,
        PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
        AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
        Status: form.getFieldValue('situacao'),
        DataEnvioDf: dataEnvioDf,
        NumeroPagina: pagina,
        NumeroRegistros: registrosPorPagina,
      };

      const response = await obterListaPresencaCodaf(filtros);

      if (response.sucesso && response.dados) {
        const dadosFiltrados = response.dados.items || [];
        const totalRegistrosAPI = response.dados.totalRegistros || 0;

        setDados(dadosFiltrados);
        setTotalRegistros(totalRegistrosAPI);
        setPaginaAtual(pagina);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar dados da lista de presença CODAF',
        });
        setDados([]);
        setTotalRegistros(0);
      }
    } catch (error) {
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar dados da lista de presença CODAF',
      });
      setDados([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
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
        setOpcoesFormacao(response.dados.items);
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
    const proposta = opcoesFormacao.find((p) => p.numeroHomologacao === option.numeroHomologacao);
    if (proposta) {
      setPropostaSelecionada(proposta);
      form.setFieldsValue({
        turmaId: undefined,
      });

      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmasAPI(response.dados);
          setTurmaDisabled(false);
        } else {
          setTurmasAPI([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setTurmasAPI([]);
        setTurmaDisabled(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar turmas da formação',
        });
      }
    }
  };

  const onClickFiltrar = () => {
    setFiltroAplicado(true);
    buscarDados(1);
  };

  const onClickLimpar = () => {
    form.resetFields();
    setDados([]);
    setTotalRegistros(0);
    setPaginaAtual(1);
    setFiltroAplicado(false);
    setPropostaSelecionada(null);
    setOpcoesFormacao([]);
    setTurmasAPI([]);
    setTurmaDisabled(true);
  };

  const handleTableChange = (pagination: any) => {
    if (pagination.pageSize !== registrosPorPagina) {
      setRegistrosPorPagina(pagination.pageSize);
      setPaginaAtual(1);
    } else {
      buscarDados(pagination.current);
    }
  };

  React.useEffect(() => {
    if (filtroAplicado) {
      buscarDados(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosPorPagina]);

  return (
    <Col>
      <ModalAvisoNovoRegistroCodaf
        visivel={modalVisible}
        onClose={() => setModalVisible(false)}
        onClickInscricoes={() => {
          setModalVisible(false);
          navigate(ROUTES.FORMACAOES_INSCRICOES);
        }}
        onClickContinuar={() => {
          setModalVisible(false);
          navigate(ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO_NOVO, { state: getStateToSave() });
        }}
      />

      <Modal
        title={
          <span
            style={{
              fontFamily: 'Roboto',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 20,
              lineHeight: '100%',
              letterSpacing: '0%',
            }}
          >
            Finalização de CODAF
          </span>
        }
        open={modalFinalizarVisible}
        onCancel={onCancelarFinalizarCodaf}
        width={672}
        styles={{
          content: {
            padding: 24,
            borderRadius: 4,
          },
          header: {
            marginBottom: 32,
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        footer={[
          <Button
            key='cancelar'
            onClick={onCancelarFinalizarCodaf}
            disabled={finalizandoCodaf}
            style={{
              fontWeight: 700,
              color: '#ff9a52',
              borderColor: '#ff9a52',
              backgroundColor: '#FFFFFF',
            }}
          >
            Cancelar
          </Button>,
          <Button
            key='finalizar'
            type='primary'
            onClick={onConfirmarFinalizarCodaf}
            loading={finalizandoCodaf}
            style={{
              fontWeight: 700,
              backgroundColor: '#ff9a52',
              borderColor: '#ff9a52',
            }}
          >
            Finalizar registro CODAF
          </Button>,
        ]}
      >
        <p
          style={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: 14,
            lineHeight: '100%',
            letterSpacing: '0%',
            margin: 0,
          }}
        >
          Este registro não possui aprovações. Após a finalização ele não poderá ser editado nem
          excluído.
          <br />
          Verifique o CODAF antes de finalizar.
        </p>
      </Modal>

      <HeaderListagemCodaf
        titulo='Lista Presença Codaf'
        podeIncluir={permissao?.podeIncluir ?? false}
        onClickNovo={() => setModalVisible(true)}
      />
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <b>
                <InputTexto
                  formItemProps={{
                    label: 'Nome da formação',
                    name: 'nomeFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NOME_FORMACAO,
                    placeholder: 'Nome da formação',
                    maxLength: 100,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <SelectAreaPromotora
                  formItemProps={{ name: 'areaPromotoraId' }}
                  selectProps={{ disabled: false }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Código da formação',
                    name: 'codigoFormacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_CODIGO_FORMACAO,
                    placeholder: 'Código da formação',
                    maxLength: 100,
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Número de homologação' name='numeroHomologacao'>
                  <AutoComplete
                    id={CF_INPUT_NUMERO_HOMOLOGACAO}
                    placeholder='Digite para buscar formação'
                    onSearch={onSearchFormacao}
                    onSelect={onSelectFormacao}
                    options={opcoesFormacao.map((opcao) => ({
                      value: opcao.numeroHomologacao.toString(),
                      label: opcao.numeroHomologacao.toString(),
                      numeroHomologacao: opcao.numeroHomologacao,
                    }))}
                    filterOption={false}
                    notFoundContent={
                      loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada'
                    }
                  />
                </Form.Item>
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                  <Select
                    placeholder='Selecione a turma'
                    options={turmasAPI.map((turma) => ({
                      label: turma.descricao,
                      value: turma.id,
                    }))}
                    disabled={turmaDisabled}
                    allowClear
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Data de envio para finalização' name='dataEnvio'>
                  <DatePicker
                    placeholder='Selecione a data'
                    format='DD/MM/YYYY'
                    style={{ width: '100%' }}
                    locale={locale}
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Situação' name='situacao' rules={[{ required: false }]}>
                  <Select
                    placeholder='Selecione a situação'
                    options={situacoes.map((s) => ({ label: s.descricao, value: s.id }))}
                    allowClear
                  />
                </Form.Item>
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 16 }} justify='end'>
            <Col>
              <Button
                type='default'
                onClick={onClickLimpar}
                style={{
                  fontWeight: 700,
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                }}
              >
                Limpar
              </Button>
            </Col>
            <Col>
              <Button
                type='primary'
                onClick={onClickFiltrar}
                loading={loading}
                style={{ fontWeight: 700 }}
              >
                Filtrar
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 8]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <div className='table-pagination-center'>
                <Table
                  columns={columns}
                  dataSource={dados}
                  rowKey='id'
                  loading={loading}
                  pagination={{
                    current: paginaAtual,
                    pageSize: registrosPorPagina,
                    total: totalRegistros,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    locale: { items_per_page: '' },
                  }}
                  onChange={handleTableChange}
                  onRow={(record) => ({
                    onClick: () =>
                      navigate(
                        ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO_EDITAR.replace(
                          ':id',
                          String(record.id),
                        ),
                        { state: getStateToSave() }
                      ),
                    style: { cursor: 'pointer' },
                  })}
                  scroll={{ x: 'max-content' }}
                  locale={{
                    emptyText: 'Não encontramos registros para os filtros aplicados',
                  }}
                />
              </div>
              <style>{`
                  .table-pagination-center .ant-pagination {
                    display: flex;
                    justify-content: center;
                  }
                  .table-pagination-center .ant-dropdown-menu {
                    background-color: #FFFFFF;
                  }
                  .table-pagination-center .ant-dropdown-menu-item {
                    color: #42474A;
                  }
                  .table-pagination-center .ant-dropdown-menu-item:hover {
                    background-color: #f5f5f5;
                    color: #42474A;
                  }
                `}</style>
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};

export default ListaPresencaCodaf;