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
import { useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { notification } from '~/components/lib/notification';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
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
} from '~/core/services/codaf-lista-presenca-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { downloadBlob } from '~/core/utils/functions';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';

const ListaPresencaCodaf: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.ListaPresencaCodaf);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [dados, setDados] = useState<CodafListaPresencaDTO[]>([]);
  //const [dadosOriginais, setDadosOriginais] = useState<CodafListaPresencaDTO[]>([]);
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
  const [, forceUpdate] = useState(0);

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

  const wasEmitido = (id: number): boolean => {
    return getEmitidos().includes(id);
  };

  const EOL_STORAGE_KEY = 'eol_txt_generated';

  const getGeneratedMap = (): Record<number, boolean> => {
    return JSON.parse(localStorage.getItem(EOL_STORAGE_KEY) || '{}');
  };

  const setGenerated = (id: number) => {
    const map = getGeneratedMap();
    map[id] = true;
    localStorage.setItem(EOL_STORAGE_KEY, JSON.stringify(map));
  };

  const wasGenerated = (id: number): boolean => {
    return !!getGeneratedMap()[id];
  };

  const onClickNovo = () => {
    setModalVisible(true);
  };

  const onClickIrParaInscricoes = () => {
    setModalVisible(false);
    navigate(ROUTES.FORMACAOES_INSCRICOES);
  };

  const onClickContinuarRegistro = () => {
    setModalVisible(false);
    navigate(ROUTES.LISTA_PRESENCA_CODAF_NOVO);
  };

  const onClickEmitirCertificado = async (record: CodafListaPresencaDTO) => {
    try {
      setLoading(true);

      // 👇 SAVE immediately so refresh keeps state
      saveEmitido(record.id);

      const response = await emitirCertificadosCodaf(record.id);
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
      const response = await imprimirRelatorioCodaf(record.id);

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `CODAF_${record.numeroHomologacao}_${record.nomeTurma}.xlsx`;

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1].replace(/['"]/g, '');
          }
        }

        downloadBlob(response.data, fileName);

        notification.success({
          message: 'Sucesso',
          description: `O arquivo CODAF para a turma ${record.nomeTurma} foi gerado com sucesso!`,
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao baixar relatório CODAF',
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao baixar relatório CODAF',
      });
    } finally {
      setLoading(false);
    }
  };

  const getMenuAcoes = (record: CodafListaPresencaDTO): MenuProps => {
    const hasCodigoCursoEol = record.codigoCursoEol !== null && record.codigoCursoEol !== undefined;
    const isStatusAguardandoDF = record.status === 2;
    const isDisabledByEol = !hasCodigoCursoEol;
    const isDisabled = isDisabledByEol || !isStatusAguardandoDF;

    const getTooltipMessage = () => {
      if (!isStatusAguardandoDF) {
        return 'Função ativa apenas para a situação Aguardando DF com valor de Cod. Curso EOL informado';
      }
      if (isDisabledByEol) {
        return 'Informe o valor de Cód. curso EOL para gerar o arquivo.';
      }
      return 'Clique para gerar TXT EOL';
    };

    const items = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        disabled: isDisabled,
        label: isDisabled ? (
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
          if (!isDisabled) {
            onClickExportarListaInscritos(record);
          }
        },
      });
    }

    items.push({
      key: 'baixar-relatorio-codaf',
      disabled: record.statusCertificacaoTurma !== 4,
      label:
        record.statusCertificacaoTurma !== 4 ? (
          <span style={{ display: 'block' }}>
            Baixar Relatório CODAF &nbsp;
            <Tooltip title='Gere os certificados para baixar o relatório CODAF.'>
              <QuestionCircleOutlined
                style={{ color: '#ff6b35', cursor: 'help', marginRight: 4 }}
              />
            </Tooltip>
          </span>
        ) : (
          <Tooltip title='Clique para exportar arquivo CODAF desta turma'>
            <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
          </Tooltip>
        ),
      onClick: (e: any) => {
        e.domEvent.stopPropagation();
        if (record.statusCertificacaoTurma === 4) {
          onClickBaixarRelatorioCodaf(record);
        }
      },
    });

    return { items };
  };

  const obterSituacaoTexto = (status: number): string => {
    const situacao = situacoes.find((s) => s.id === status);
    return situacao?.descricao || 'Desconhecido';
  };

  const getCertificadoButtonState = (record: CodafListaPresencaDTO, loading: boolean) => {
    const gerado = wasGenerated(record.id);
    const emitido = wasEmitido(record.id);
    console.log(emitido, gerado);
    const status = record.statusCertificacaoTurma;
    console.log(loading);

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

  const colunasBase: ColumnsType<CodafListaPresencaDTO> = [
    {
      key: 'codigoFormacao',
      title: 'Código da formação',
      dataIndex: 'codigoFormacao',
      width: ocultarColunas ? 100 : 80,
    },
    {
      key: 'numeroHomologacao',
      title: 'Número de homologação',
      dataIndex: 'numeroHomologacao',
      width: ocultarColunas ? 100 : 80,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      /*ellipsis: true,
      width: ocultarColunas ? undefined : 'auto',*/
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: 'nomeAreaPromotora',
      title: 'Área promotora',
      dataIndex: 'nomeAreaPromotora',
      width: ocultarColunas ? 200 : 150,
      ellipsis: true,
    },
    {
      key: 'nomeTurma',
      title: 'Turma',
      dataIndex: 'nomeTurma',
      width: ocultarColunas ? 150 : 120,
      ellipsis: true,
    },
    {
      key: 'status',
      title: 'Situação',
      dataIndex: 'status',
      width: ocultarColunas ? 150 : 100,
      render: (status: number) => obterSituacaoTexto(status),
    },
  ];

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
        const { text, disabled } = getCertificadoButtonState(record, loading);

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
      console.log(propostaSelecionada);

      // Buscar turmas da proposta selecionada
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
      // A busca será feita pelo useEffect
    } else {
      buscarDados(pagination.current);
    }
  };

  // Recarrega os dados quando o tamanho da página muda
  React.useEffect(() => {
    if (filtroAplicado) {
      buscarDados(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosPorPagina]);

  return (
    <Col>
      <Modal
        title={
          <span
            style={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '100%',
              letterSpacing: '0%',
            }}
          >
            Atenção!
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        centered
        width={600}
        footer={[
          <Button
            key='inscricoes'
            onClick={onClickIrParaInscricoes}
            style={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              fontWeight: 500,
            }}
          >
            Ir para tela de inscrições
          </Button>,
          <Button key='continuar' type='primary' onClick={onClickContinuarRegistro}>
            Continuar registro
          </Button>,
        ]}
      >
        <br></br>
        <p>
          Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na
          formação. Caso necessário, você pode realizar o cadastro pela tela de inscrições.
        </p>
        <br></br>
      </Modal>
      <HeaderPage title='Lista Presença Codaf'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                disabled={!permissao.podeIncluir}
                onClick={() => onClickNovo()}
                style={{ fontWeight: 700 }}
              >
                Novo registro
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
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
          {filtroAplicado && (
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
                        navigate(`/formacoes/lista-presenca-codaf/editar/${record.id}`),
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
          )}
        </CardContent>
      </Form>
    </Col>
  );
};

export default ListaPresencaCodaf;
