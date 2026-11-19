import { QuestionCircleOutlined } from '@ant-design/icons';
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
import locale from 'antd/lib/date-picker/locale/pt_BR';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
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
  SituacaoCodafConferenciaTagDisplay,
  StatusCodafConferencia,
} from '~/core/enum/status-codaf-conferencia';
import {
  CodafConferenciaDTO,
  excluirCodafConferencia,
  obterDetalhesPropostaConferenciaComTurmasPorId,
  obterListaCodafConferencia,
  PropostaConferenciaTurmaDTO,
} from '~/core/services/codaf-conferencia-service';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';
import ModalExcluir from '../lista-presenca-codaf/cadastro/componentes/modal-excluir/modal-excluir';
import { criarColunasBaseListagemCodaf } from '../shared/componentes/codaf-colunas-factory';
import { HeaderListagemCodaf } from '../shared/componentes/header-listagem-codaf';
import { ModalConfirmacaoInscritosConferencia } from './componentes/modal-confirmacao-inscritos';

dayjs.locale('pt-br');

export interface IStateLocationCodafConferencia {
  formValues?: Record<string, any>;
  paginaCorrente?: number;
  registrosPorPagina?: number;
  filtroUtilizado?: boolean;
}

const COR_PRIMARIA = '#ff6b35';
export const TOOLTIP_NAO_IMPLEMENTADO = 'Não implementado!';

export interface CodafConferenciaProps {
  exclusaoHabilitada?: boolean;
}

const SITUACOES_CODAF_CONFERENCIA = [
  {
    id: StatusCodafConferencia.INICIADO,
    descricao: SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.INICIADO],
  },
  {
    id: StatusCodafConferencia.AGUARDANDO_FINALIZACAO,
    descricao: SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.AGUARDANDO_FINALIZACAO],
  },
  {
    id: StatusCodafConferencia.FINALIZADO,
    descricao: SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.FINALIZADO],
  },
];

const CERTIFICADO_ESTADOS: Record<number, { label: string; disabled: boolean }> = {
  0: { label: 'Sem certificado', disabled: true },
  1: { label: 'Não emitidos', disabled: true },
  2: { label: 'Emitir certificados', disabled: false },
  3: { label: 'Emitindo certificado', disabled: true },
  4: { label: 'Certificados emitidos', disabled: true },
};

export const obterSituacaoTexto = (status: number): string =>
  SITUACOES_CODAF_CONFERENCIA.find((s) => s.id === status)?.descricao ?? 'Desconhecido';

export const obterEstadoBotaoCertificado = (record: CodafConferenciaDTO) => {
  if (!record.possuiAprovacoes) {
    return { label: 'Sem aprovações', disabled: true };
  }

  return CERTIFICADO_ESTADOS[record.statusCertificacaoTurma ?? -1] ?? { label: '—', disabled: true };
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

const CodafConferencia: React.FC<CodafConferenciaProps> = ({ exclusaoHabilitada = false }) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const permissao = obterPermissaoPorMenu(MenuEnum.CodafFormacoesConferencia);

  const [dados, setDados] = useState<CodafConferenciaDTO[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [filtroUtilizado, setFiltroUtilizado] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [turmasProposta, setTurmasProposta] = useState<PropostaConferenciaTurmaDTO[]>([]);
  const [turmaDesabilitada, setTurmaDesabilitada] = useState(true);

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [loadingExclusao, setLoadingExclusao] = useState(false);
  const [registroParaExcluir, setRegistroParaExcluir] = useState<CodafConferenciaDTO | null>(null);

  const carregarDadosCodaf = async (pagina: number, tamanhoPagina: number) => {
    setCarregando(true);
    try {
      const dataCriacao = form.getFieldValue('dataCriacao');
      const codigoFormacao = form.getFieldValue('codigoFormacao');
      const numeroHomologacao = form.getFieldValue('numeroHomologacao');

      const filtros = {
        NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
        CodigoFormacao: codigoFormacao ? Number(codigoFormacao) : undefined,
        NumeroHomologacao: numeroHomologacao ? Number(numeroHomologacao) : undefined,
        PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
        AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
        Status: form.getFieldValue('situacao'),
        DataCriacao: dataCriacao ? dayjs(dataCriacao).format('YYYY-MM-DD') : undefined,
        NumeroPagina: pagina,
        NumeroRegistros: tamanhoPagina,
      };

      const response = await obterListaCodafConferencia(filtros);

      if (response.sucesso && response.dados) {
        setTotalRegistros(response.dados.totalRegistros || 0);
        setPaginaCorrente(pagina);
        setDados(response.dados.items || []);
      } else {
        setTotalRegistros(0);
        setDados([]);
        notification.error({
          message: 'Erro',
          description: 'Erro ao buscar dados da lista de CODAF Conferência',
        });
      }
    } catch {
      setTotalRegistros(0);
      setDados([]);
      notification.error({
        message: 'Erro',
        description: 'Erro ao buscar dados da lista de CODAF Conferência',
      });
    } finally {
      setCarregando(false);
    }
  };

  const resolverTurmasDaProposta = async (codigoFormacao?: string | number) => {
    const valorLimpo = Number(String(codigoFormacao || '').replaceAll(/\D/g, ''));

    if (valorLimpo <= 0) {
      return { turmas: [] as PropostaConferenciaTurmaDTO[], desabilitada: true };
    }

    try {
      const resposta = await obterDetalhesPropostaConferenciaComTurmasPorId(valorLimpo);
      const turmas = resposta.sucesso && resposta.dados?.turmas?.length ? resposta.dados.turmas : [];

      return {
        turmas,
        desabilitada: turmas.length === 0,
      };
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao obter turmas da formação',
      });
      return { turmas: [] as PropostaConferenciaTurmaDTO[], desabilitada: true };
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      const state = location.state as IStateLocationCodafConferencia | null;

      if (!state) {
        await carregarDadosCodaf(1, 10);
        return;
      }

      const { turmas, desabilitada } = await resolverTurmasDaProposta(
        state.formValues?.codigoFormacao,
      );
      setTurmasProposta(turmas);
      setTurmaDesabilitada(desabilitada);

      if (state.formValues) form.setFieldsValue(state.formValues);
      if (state.paginaCorrente) setPaginaCorrente(state.paginaCorrente);
      if (state.registrosPorPagina) setRegistrosPorPagina(state.registrosPorPagina);
      if (state.filtroUtilizado) setFiltroUtilizado(state.filtroUtilizado);

      await carregarDadosCodaf(state.paginaCorrente ?? 1, state.registrosPorPagina ?? 10);
    };

    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStateToSave = (): IStateLocationCodafConferencia => ({
    formValues: form.getFieldsValue(),
    paginaCorrente,
    registrosPorPagina,
    filtroUtilizado,
  });

  const aoMudarCodigoProposta = () => {
    form.setFieldsValue({ turmaId: undefined });
    setTurmasProposta([]);
    setTurmaDesabilitada(true);
  };

  const aoSairDoCampoCodigoProposta = async (valor: string) => {
    const { turmas, desabilitada } = await resolverTurmasDaProposta(valor);
    setTurmasProposta(turmas);
    setTurmaDesabilitada(desabilitada);
  };

  const aoClicarEmLimpar = () => {
    form.resetFields();
    setPaginaCorrente(1);
    setTotalRegistros(0);
    setFiltroUtilizado(false);
    setTurmasProposta([]);
    setTurmaDesabilitada(true);
    carregarDadosCodaf(1, registrosPorPagina);
  };

  const aoClicarEmFiltrar = () => {
    setFiltroUtilizado(true);
    carregarDadosCodaf(1, registrosPorPagina);
  };

  const lidarComAlteracoesDaTabela = (paginacao: { current?: number; pageSize?: number }) => {
    if (paginacao.pageSize && paginacao.pageSize !== registrosPorPagina) {
      setRegistrosPorPagina(paginacao.pageSize);
      setPaginaCorrente(1);
      carregarDadosCodaf(1, paginacao.pageSize);
      return;
    }

    carregarDadosCodaf(paginacao.current ?? 1, registrosPorPagina);
  };

  const cancelarExclusao = () => {
    setModalExcluirVisible(false);
    setRegistroParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!registroParaExcluir) {
      cancelarExclusao();
      return;
    }

    try {
      setLoadingExclusao(true);
      const response = await excluirCodafConferencia(registroParaExcluir.id);

      if (response.status === 204 || response.sucesso) {
        notification.success({
          message: 'Sucesso',
          description: 'Registro excluído com sucesso!',
        });
        cancelarExclusao();
        await carregarDadosCodaf(paginaCorrente, registrosPorPagina);
      } else {
        notification.error({
          message: 'Erro',
          description: response.mensagens?.[0] || 'Erro ao excluir o registro',
        });
      }
    } catch {
      notification.error({
        message: 'Erro',
        description: 'Erro ao excluir o registro',
      });
    } finally {
      setLoadingExclusao(false);
    }
  };

  const getMenuAcoes = (record: CodafConferenciaDTO): MenuProps => {
    const items: NonNullable<MenuProps['items']> = [
      {
        key: 'gerar-txt-eol',
        disabled: true,
        label: (
          <span style={{ display: 'block' }}>
            Gerar TXT EOL &nbsp;
            <Tooltip title='Função ativa após liberação da geração de TXT EOL para CODAF de conferência.'>
              <QuestionCircleOutlined style={{ color: COR_PRIMARIA, cursor: 'help' }} />
            </Tooltip>
          </span>
        ),
      },
      {
        key: 'baixar-relatorio-codaf',
        disabled: true,
        label: (
          <span style={{ display: 'block' }}>
            Baixar relatório CODAF &nbsp;
            <Tooltip title='Gere os certificados para baixar o relatório CODAF.'>
              <QuestionCircleOutlined style={{ color: COR_PRIMARIA, cursor: 'help' }} />
            </Tooltip>
          </span>
        ),
      },
    ];

    if (record.status === StatusCodafConferencia.INICIADO && permissao?.podeExcluir) {
      items.push({
        key: 'excluir',
        label: (
          <Tooltip title={exclusaoHabilitada ? undefined : TOOLTIP_NAO_IMPLEMENTADO}>
            <span style={{ display: 'block' }}>Excluir</span>
          </Tooltip>
        ),
        onClick: (e) => {
          e.domEvent.stopPropagation();
          if (!exclusaoHabilitada) return;
          setRegistroParaExcluir(record);
          setModalExcluirVisible(true);
        },
      });
    }

    return { items };
  };

  const colunasBase = criarColunasBaseListagemCodaf<CodafConferenciaDTO>(
    false,
    obterSituacaoTexto,
  ).filter((col) => col.key !== 'dataPrimeiroEnvioDf');

  const colunaCertificado: ColumnsType<CodafConferenciaDTO> = [
    {
      key: 'certificado',
      title: (
        <span>
          Certificado{' '}
          <Tooltip title='Ao emitir certificado, a conclusão do curso é gerada para os conferencistas aprovados.'>
            <QuestionCircleOutlined style={{ color: COR_PRIMARIA, cursor: 'help' }} />
          </Tooltip>
        </span>
      ),
      width: 220,
      render: (_value, record) => {
        const { label, disabled } = obterEstadoBotaoCertificado(record);

        return (
          <Button
            type='default'
            icon={<FiPrinter />}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              borderColor: disabled ? '#ccc' : COR_PRIMARIA,
              color: disabled ? '#999' : COR_PRIMARIA,
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {label}
          </Button>
        );
      },
    },
  ];

  const colunaAcoes: ColumnsType<CodafConferenciaDTO> = [
    {
      key: 'acoes',
      title: 'Ações',
      width: 80,
      align: 'center',
      render: (_value, record) => (
        <Dropdown
          menu={getMenuAcoes(record)}
          trigger={['click']}
          placement='bottomRight'
          dropdownRender={renderDropdownMenu}
        >
          <Button
            type='default'
            icon={<BsThreeDotsVertical />}
            style={{ borderColor: COR_PRIMARIA, color: COR_PRIMARIA }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const columns: ColumnsType<CodafConferenciaDTO> = [
    ...colunasBase,
    ...colunaCertificado,
    ...colunaAcoes,
  ];

  return (
    <Col>
      <ModalConfirmacaoInscritosConferencia
        visivel={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onClickInscricoes={() => {
          setModalVisivel(false);
          navigate(ROUTES.FORMACAOES_INSCRICOES);
        }}
        onClickContinuar={() => {
          setModalVisivel(false);
          navigate(ROUTES.CODAF_CONFERENCIA_NOVO, { state: getStateToSave() });
        }}
      />

      <ModalExcluir
        visible={modalExcluirVisible}
        onConfirm={confirmarExclusao}
        onCancel={cancelarExclusao}
        loading={loadingExclusao}
      />

      <HeaderListagemCodaf
        titulo='CODAF Formações de Conferência'
        podeIncluir={permissao?.podeIncluir ?? false}
        onClickNovo={() => setModalVisivel(true)}
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
                    placeholder: 'Código da formação',
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
                    placeholder: 'Número de homologação',
                    maxLength: 20,
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
                    placeholder='Selecione a turma'
                    options={turmasProposta.map((turma) => ({
                      label: turma.nome || turma.descricao,
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
                <Form.Item label='Data de criação' name='dataCriacao'>
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
                    options={SITUACOES_CODAF_CONFERENCIA.map((s) => ({
                      label: s.descricao,
                      value: s.id,
                    }))}
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
                  borderColor: COR_PRIMARIA,
                  color: COR_PRIMARIA,
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
                    pageSize: registrosPorPagina,
                    total: totalRegistros,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 30, 50, 100],
                    locale: { items_per_page: '' },
                  }}
                  onChange={lidarComAlteracoesDaTabela}
                  onRow={(record) => ({
                    onClick: () =>
                      navigate(
                        ROUTES.CODAF_CONFERENCIA_EDITAR.replace(':id', String(record.id)),
                        { state: getStateToSave() },
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

export default CodafConferencia;
