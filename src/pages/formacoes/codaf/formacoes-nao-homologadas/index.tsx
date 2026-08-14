import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
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
import { obterDetalhesPropostaComTurmasPorId } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { CodafNaoHomologadoListagemDTO, emitirDeclaracaoCodafNaoHomologado, obterListaCodafNaoHomologado } from '~/core/services/codaf-nao-homologado-service';
import { criarColunasBaseListagemCodaf } from '../shared/componentes/codaf-colunas-factory';
import { ModalAvisoNovoRegistroCodaf } from '../shared/componentes/modal-aviso-novo-registro-codaf';
import { HeaderListagemCodaf } from '../shared/componentes/header-listagem-codaf';

const HEADER_TEXT_STYLE = {
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const renderDropdownMenu = (menu: React.ReactNode) => (
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
);

const CodafFormacoesNaoHomologadas: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesNaoHomologadas);
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [dados, setDados] = useState<CodafNaoHomologadoListagemDTO[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [totalRegistrosApi, setTotalRegistrosApi] = useState(0);
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const [registrosApiPorPagina, setRegistrosApiPorPagina] = useState(10);
  const [filtroUtilizado, setFiltroUtilizado] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [turmasProposta, setTurmasProposta] = useState<RetornoListagemDTO[]>([]);
  const [turmaDesabilitada, setTurmaDesabilitada] = useState(true);
  const [_atualizacao, forcarAtualizacao] = useState(0);

  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const ocultarColunas = ehPerfilDF || ehPerfilEMFORPEF;

  const status = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando finalização' },
    { id: 3, descricao: 'Finalizado' },
  ];
  
  const location = useLocation();

  interface IStateLocationCodaf {
    formValues?: Record<string, any>;
    paginaCorrente?: number;
    registrosApiPorPagina?: number;
    filtroUtilizado?: boolean;
  }
  React.useEffect(() => {
    const resolverTurmasProposta = async (codigoFormacao?: string) => {
      const valorLimpo = Number(String(codigoFormacao || '').replace(/\D/g, ''));
      
      if (valorLimpo <= 0) return { turmas: [], desabilitado: true };

      try {
        const { sucesso, dados } = await obterDetalhesPropostaComTurmasPorId(valorLimpo, false);
        const possuiTurmas = sucesso && (dados?.turmas?.length ?? 0) > 0;
        
        return {
          turmas: possuiTurmas ? dados!.turmas : [],
          desabilitado: !possuiTurmas
        };
      } catch (e) {
        console.error(e);
        return { turmas: [], desabilitado: true };
      }
    };

    const restaurarEstadoLocal = async (estado: IStateLocationCodaf) => {
      const { turmas, desabilitado } = await resolverTurmasProposta(estado.formValues?.codigoFormacao);
      
      setTurmasProposta(turmas);
      setTurmaDesabilitada(desabilitado);
      
      if (estado.formValues) form.setFieldsValue(estado.formValues);
      if (estado.paginaCorrente) setPaginaCorrente(estado.paginaCorrente);
      if (estado.registrosApiPorPagina) setRegistrosApiPorPagina(estado.registrosApiPorPagina);
      if (estado.filtroUtilizado) setFiltroUtilizado(estado.filtroUtilizado);
      
      carregarDadosCodaf(estado.paginaCorrente ?? 1);
    };

    const inicializar = async () => {
      const state = location.state as IStateLocationCodaf | null;

      if (state) {
        await restaurarEstadoLocal(state);
      } else {
        carregarDadosCodaf(1);
      }
    };

    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStateToSave = () => ({
    formValues: form.getFieldsValue(),
    paginaCorrente,
    registrosApiPorPagina,
    filtroUtilizado,
  });

  const getMenuAcoes = (): MenuProps => {
    const items = [
      {
        key: 'exportar-lista-inscritos',
        label: 'Exportar Lista de inscritos',
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
        },
      },
      {
        key: 'baixar-relatorio-codaf',
        label:
          <Tooltip title='Gere as declarações para baixar o relatório CODAF.'>
            <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
          </Tooltip>,
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
        },
      },
    ];

    return { items };
  };

  const obterSituacaoTexto = (idStatus: number): string => status.find((s) => s.id === idStatus)?.descricao || 'Desconhecido';

  const aoClicarEmEmitirDeclaracoes = async (record: CodafNaoHomologadoListagemDTO) => {
    try {
      setCarregando(true);

      const resposta = await emitirDeclaracaoCodafNaoHomologado(record.id);
      forcarAtualizacao((prev) => prev + 1);
      if (resposta.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Emissão das declarações foi solicitada com sucesso.',
        });

        carregarDadosCodaf(paginaCorrente);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Erro ao emitir as declarações.',
        });
      }
    } catch (error) {
      console.error('Erro ao emitir declarações:', error);
      notification.error({
        message: 'Erro',
        description: 'Ocorreu um erro ao emitir as declarações.',
      });
    }
    finally {
      setCarregando(false);
    }
  };

  const getDeclaracaoButtonState = (record: CodafNaoHomologadoListagemDTO) => {
    const status = record.statusDeclaracaoTurma;

    if (status === 0) return { text: 'Sem declaração', disabled: true };
    if (status === 1) return { text: 'Não emitidas', disabled: true };
    if (status === 2) return { text: 'Emitir declarações', disabled: false };
    if (status === 3) return { text: 'Emitindo declarações', disabled: true };
    if (status === 4) return { text: 'Declarações emitidas', disabled: true };

    return { text: '—', disabled: true };
  };

  const colunasBase = criarColunasBaseListagemCodaf<CodafNaoHomologadoListagemDTO>(ocultarColunas, obterSituacaoTexto);

  const colunasAdicionais: ColumnsType<CodafNaoHomologadoListagemDTO> = [
    {
      key: 'declaracao',
      title: (
        <span>
          Declaração{' '}
          <Tooltip title='Ao emitir declaração, a conclusão do curso é gerada tanto para cursistas quanto para regentes.'>
            <QuestionCircleOutlined style={{ color: '#ff6b35', cursor: 'help' }} />
          </Tooltip>
        </span>
      ),
      width: 220,
      render: (_: any, record: CodafNaoHomologadoListagemDTO) => {
        const { text, disabled } = getDeclaracaoButtonState(record);

        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            loading={carregando && text === 'Emitindo declarações'}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              aoClicarEmEmitirDeclaracoes(record);
            }}
            style={{
              width: '100%',
              borderColor: disabled ? '#ccc':'#ff6b35',
              color: disabled ? '#999':'#ff6b35',
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

  const colunaAcoes: ColumnsType<CodafNaoHomologadoListagemDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_: any) => (
        <Dropdown
          menu={getMenuAcoes()}
          trigger={['click']}
          placement='bottomRight'
          dropdownRender={renderDropdownMenu}
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

  const carregarDadosCodaf = async (pagina = 1) => {
    setCarregando(true);
    try {
      const dataFinalizacao = form.getFieldValue('dataFinalizacao');
      const dataFinalizacaoDf = dataFinalizacao ? dayjs(dataFinalizacao).format('YYYY-MM-DD') : undefined;

      const numeroHomologacao = form.getFieldValue('numeroHomologacao');

      const filtros = {
        NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
        CodigoFormacao: form.getFieldValue('codigoFormacao') || undefined,
        NumeroHomologacao: numeroHomologacao ? Number(numeroHomologacao) : undefined,
        PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
        AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
        Status: form.getFieldValue('situacao'),
        DataFinalizacao: dataFinalizacaoDf,
        NumeroPagina: pagina,
        NumeroRegistros: registrosApiPorPagina,
      };

      const response = await obterListaCodafNaoHomologado(filtros);

      if (response.sucesso && response.dados) {
        const totalRegistrosAPI = response.dados.totalRegistros || 0;
        const dadosFiltrados = response.dados.items || [];

        setTotalRegistrosApi(totalRegistrosAPI);
        setPaginaCorrente(pagina);
        setDados(dadosFiltrados);
      } else {
        setTotalRegistrosApi(0);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar dados da lista do CODAF Não Homologado',
        });
        setDados([]);
      }
    } catch (error) {
      setDados([]);
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar dados da lista do CODAF Não Homologado',
      });
      setTotalRegistrosApi(0);
      console.log('Erro ao buscar dados da lista do CODAF Não Homologado:', error);
    } finally {
      setCarregando(false);
    }
  };

  const aoMudarCodigoProposta = () => {    
    setTurmaDesabilitada(true);
    setTurmasProposta([]);
  }

  const aoSairDoCampoCodigoProposta = async (_valor: string) => {
    const value = Number(_valor.trim().replaceAll(/\D/g, ''));

    if (value === 0) {
      setTurmaDesabilitada(true);
      setTurmasProposta([]);
      return;
    }

    try {
      const resposta = await obterDetalhesPropostaComTurmasPorId(value, false);

      if (resposta.sucesso && resposta.dados) {
        if (resposta.dados.turmas && resposta.dados.turmas.length > 0) {
          setTurmasProposta(resposta.dados.turmas);
          setTurmaDesabilitada(false);
          form.setFieldsValue({
            numeroHomologacao: resposta.dados.numeroFormacao || undefined,
          });
        } else {
          setTurmasProposta([]);
          setTurmaDesabilitada(true);
        }
        form.setFieldsValue({
          turmaId: undefined
        });
      } else {
        form.setFieldsValue({
          turmaId: undefined,
        });
        setTurmasProposta([]);
        setTurmaDesabilitada(true);        
      }
    } catch (error) {
      console.error('Erro ao obter detalhes da proposta:', error);
      setTurmasProposta([]);
      setTurmaDesabilitada(true);
      notification.error({
        message: 'Erro',
        description: 'Erro ao obter detalhes da proposta',
      });
    }
  };

  const aoClicarEmLimpar = () => {
    setPaginaCorrente(1);    
    setTotalRegistrosApi(0);
    setFiltroUtilizado(false);
    setTurmaDesabilitada(true);
    setTurmasProposta([]);
    setDados([]);
    form.resetFields();
  };

  const aoClicarEmFiltrar = () => {    
    carregarDadosCodaf(1);
    setFiltroUtilizado(true);
  };

  const lidarComAlteracoesDaTabela = (paginacao: any) => {
    if (paginacao.pageSize !== registrosApiPorPagina) {
      setPaginaCorrente(1);
      setRegistrosApiPorPagina(paginacao.pageSize);
      return;
    }
    carregarDadosCodaf(paginacao.current);
  };

  React.useEffect(() => {
    if (filtroUtilizado) {
      carregarDadosCodaf(1);
    }
  }, [registrosApiPorPagina]);

  return (
    <Col>
      <ModalAvisoNovoRegistroCodaf
        visivel={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onClickInscricoes={() => { setModalVisivel(false); navigate(ROUTES.FORMACAOES_INSCRICOES); }}
        onClickContinuar={() => { setModalVisivel(false); navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO_NOVO, { state: getStateToSave() }); }}
      />

      <HeaderListagemCodaf
        titulo="CODAF não homologado"
        podeIncluir={permissao.podeIncluir ?? false}
        onClickNovo={() => setModalVisivel(true)}
      />
      
      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <div style={HEADER_TEXT_STYLE}>
                <div>
                  Aqui você confere todos os CODAFs não homologados registrados no sistema. Use os campos abaixo para refinar a sua busca.
                </div>
              </div>
            </Col>
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
                    placeholder: 'Digite o nome da formação',
                    maxLength: 200,
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
                  placeholder='Selecione'
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
                    placeholder: 'Digite o código da formação',
                    maxLength: 19,
                    onChange: aoMudarCodigoProposta,
                    onBlur: (e) => aoSairDoCampoCodigoProposta(e.target.value),
                  }}
                />
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <InputNumero
                  formItemProps={{
                    label: 'Número de homologação',
                    name: 'numeroHomologacao',
                    rules: [{ required: false }],
                  }}
                  inputProps={{
                    id: CF_INPUT_NUMERO_HOMOLOGACAO,
                    placeholder: '00000',
                    maxLength: 20,
                    disabled: false,
                  }}
                />
              </b>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Turma' name='turmaId' rules={[{ required: false }]}>
                  <Select
                    placeholder='Selecione'
                    options={turmasProposta.map((turma) => ({
                      label: turma.descricao,
                      value: turma.id,
                    }))}
                    disabled={turmaDesabilitada}
                    allowClear
                  />
                </Form.Item>
              </b>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <b>
                <Form.Item label='Data de envio para finalização' name='dataEnvio'>
                  <DatePicker
                    placeholder='00/00/0000'
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
                    placeholder='Selecione'
                    options={status.map((s) => ({ label: s.descricao, value: s.id }))}
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
                onClick={aoClicarEmLimpar}
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
                onClick={aoClicarEmFiltrar}
                loading={carregando}
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
                  loading={carregando}
                  pagination={{
                    current: paginaCorrente,
                    pageSize: registrosApiPorPagina,
                    total: totalRegistrosApi,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    locale: { items_per_page: '' },
                  }}
                  onChange={lidarComAlteracoesDaTabela}
                  onRow={(record) => ({
                    onClick: () =>
                      navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO_EDITAR.replace(':id', String(record.id)), { state: getStateToSave() }),
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

export default CodafFormacoesNaoHomologadas;