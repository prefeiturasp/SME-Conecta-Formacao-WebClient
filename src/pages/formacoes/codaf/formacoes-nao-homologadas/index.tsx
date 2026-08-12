import {
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
import locale from 'antd/lib/date-picker/locale/pt_BR';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
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
import { obterDetalhesPropostaComTurmasPorId } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { onClickVoltar } from '~/core/utils/form';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { CodafNaoHomologadoListagemDTO, obterListaCodafNaoHomologado } from '~/core/services/codaf-nao-homologado-service';

const HEADER_TEXT_STYLE = {
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

type DropdownMenuContentProps = {
  menu: React.ReactNode;
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ menu }) => (
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
  const [turmaDesabilitada, setTurmaDisabilitada] = useState(true);

  const ehPerfilDF = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.DF];
  const ehPerfilEMFORPEF = perfilSelecionado === 'EMFORPEF';
  const ocultarColunas = ehPerfilDF || ehPerfilEMFORPEF;

  const status = [
    { id: 1, descricao: 'Iniciado' },
    { id: 2, descricao: 'Aguardando finalização' },
    { id: 3, descricao: 'Finalizado' },
  ];
  
  React.useEffect(() => {    
    carregarDadosCodaf(1);
  }, []);

  const onClickNovo = () => {
    setModalVisivel(true);
  };

  const onClickIrParaInscricoes = () => {
    setModalVisivel(false);
    navigate(ROUTES.FORMACAOES_INSCRICOES);
  };

  const onClickContinuarRegistro = () => {
    setModalVisivel(false);
    navigate(ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO_NOVO);
  };

  const getMenuAcoes = (): MenuProps => {
    const items = [];

    if (!ocultarColunas) {
      items.push({
        key: 'exportar-lista-inscritos',
        label: 'Exportar Lista de inscritos',
        onClick: (e: any) => {
          e.domEvent.stopPropagation();
        },
      });
    }

    items.push({
      key: 'baixar-relatorio-codaf',
      label:
          <Tooltip title='Gere as declarações para baixar o relatório CODAF.'>
            <span style={{ display: 'block' }}>Baixar Relatório CODAF</span>
          </Tooltip>,
      onClick: (e: any) => {
        e.domEvent.stopPropagation();
      },
    });

    return { items };
  };

  const obterSituacaoTexto = (idStatus: number): string => {
    const situacao = status.find((s) => s.id === idStatus);
    return situacao?.descricao || 'Desconhecido';
  };

  const getDeclaracaoButtonState = () => {
    const status = 0; 

    if (status === 0) return { text: 'Sem declaração', disabled: true };
    if (status === 1) return { text: 'Não emitidas', disabled: true };
    if (status === 2) return { text: 'Emitir declarações', disabled: false };
    if (status === 3) return { text: 'Emitindo declarações', disabled: true };
    if (status === 4) return { text: 'Declarações emitidas', disabled: true };

    return { text: '—', disabled: true };
  };

  const colunasBase: ColumnsType<CodafNaoHomologadoListagemDTO> = [
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
      render: (_: any) => {
        const { text, disabled } = getDeclaracaoButtonState();

        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            loading={carregando && text === 'Emitindo declarações'}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
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
          dropdownRender={(menu) => <DropdownMenuContent menu={menu} />}
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
    } finally {
      setCarregando(false);
    }
  };

  const aoMudarCodigoProposta = () => {    
    setTurmaDisabilitada(true);
    setTurmasProposta([]);
  }

  const aoSairDoCampoCodigoProposta = async (_valor: string) => {
    const value = Number(_valor.trim().replaceAll(/\D/g, ''));

    if (value === 0) {
      setTurmaDisabilitada(true);
      setTurmasProposta([]);
      return;
    }

    try {
      const resposta = await obterDetalhesPropostaComTurmasPorId(value, false);

      if (resposta.sucesso && resposta.dados) {
        if (resposta.dados.turmas && resposta.dados.turmas.length > 0) {
          setTurmasProposta(resposta.dados.turmas);
          setTurmaDisabilitada(false);
        } else {
          setTurmasProposta([]);
          setTurmaDisabilitada(true);
        }
        form.setFieldsValue({
          turmaId: undefined
        });
      } else {
        form.setFieldsValue({
          turmaId: undefined,
        });
        setTurmasProposta([]);
        setTurmaDisabilitada(true);        
      }
    } catch (error) {
      console.error('Erro ao obter detalhes da proposta:', error);
      setTurmasProposta([]);
      setTurmaDisabilitada(true);
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
    setTurmaDisabilitada(true);
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
        open={modalVisivel}
        onCancel={() => setModalVisivel(false)}
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
      <HeaderPage title='CODAF não homologado'>
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
        </CardContent>
      </Form>
    </Col>
  );
};

export default CodafFormacoesNaoHomologadas;
