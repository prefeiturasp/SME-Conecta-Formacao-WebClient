import {
  Button,
  Row,
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import DataTable from '~/components/lib/card-table';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { notification } from '~/components/lib/notification';
import {
  CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA,
  DESEJA_CANCELAR_INSCRICAO_CURSISTA,
} from '~/core/constants/mensagens';
import {
  TipoPerfilEnum,
  TipoPerfilTagDisplay,
} from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import {
  URL_INSCRICAO,
  cancelarInscricao,
} from '~/core/services/inscricao-service';
import ModalEditCargoFuncaoButton from '../components/modal-edit-cargo-funcao/modal-edit-cargo-funcao-button';
import ptBR from "antd/es/date-picker/locale/pt_BR";
import "dayjs/locale/pt-br";


const { RangePicker } = DatePicker;

export interface InscricaoProps {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  nomeTurma: string;
  datas: string;
  cargoFuncaoCodigo: string;
  cargoFuncao: string;
  tipoVinculo?: number;
  situacao: string;
  podeCancelar: boolean;
  integrarNoSga: boolean;
  iniciado: boolean;
}

export const MinhasInscricoesListaPaginada = () => {
  const { tableState } = useContext(DataTableContext);
  const perfilSelecionado = useAppSelector(
    (store) => store.perfil.perfilSelecionado?.perfilNome,
  );

  const [form] = Form.useForm();
  const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'finalizadas'>(
    'andamento',
  );
  const [filtros, setFiltros] = useState<any>({});

  const ehCursista =
    perfilSelecionado ===
    TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  // ================================
  // CONFIRMAÇÃO CANCELAMENTO
  // ================================

  const mensagemConfirmacao = (record: InscricaoProps) => {
    if (record.integrarNoSga && record.iniciado && ehCursista)
      return DESEJA_CANCELAR_INSCRICAO_CURSISTA;

    if (record.integrarNoSga && record.iniciado && !ehCursista)
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;

    if (!record.integrarNoSga && !record.iniciado && !ehCursista)
      return CANCELAR_INSCRICAO;

    return DESEJA_CANCELAR_INSCRICAO;
  };

  // ================================
  // FILTROS
  // ================================

  const handleFiltroChange = (_: any, allValues: any) => {
    const novosFiltros: any = { ...allValues };

    if (allValues.periodo) {
      novosFiltros.DataInicial = allValues.periodo[0]
        ? dayjs(allValues.periodo[0]).format('YYYY-MM-DD')
        : undefined;

      novosFiltros.DataFinal = allValues.periodo[1]
        ? dayjs(allValues.periodo[1]).format('YYYY-MM-DD')
        : undefined;
    } else {
      novosFiltros.DataInicial = undefined;
      novosFiltros.DataFinal = undefined;
    }

    // Data única
    if (allValues.DataInscricao) {
      novosFiltros.DataInscricao = dayjs(
        allValues.DataInscricao,
      ).format('YYYY-MM-DD');
    }

    delete novosFiltros.periodo;

    setFiltros(novosFiltros);
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  };

  const url = useMemo(() => {
    const base =
      abaAtiva === 'andamento'
        ? `${URL_INSCRICAO}/proximas`
        : `${URL_INSCRICAO}/finalizadas`;

    const query = buildQueryParams();

    return query ? `${base}?${query}` : base;
  }, [filtros, abaAtiva]);

  const situacoesOptions = [
    { label: 'Confirmada', value: 1 },
    { label: 'Enviada', value: 2 },
    { label: 'Aguardando a análise', value: 3 },
    { label: 'Cancelada', value: 4 },
    { label: 'Em espera', value: 5 },
    { label: 'Transferida', value: 6 },
  ];

  const situacaoAprovacaoOptions = [
    { label: 'Aprovado', value: 1 },
    { label: 'Reprovado', value: 2 },
    { label: 'Não inscrito', value: 3 },
  ];

  // ================================
  // COLUNAS BASE (COMUNS ÀS DUAS ABAS)
  // ================================
  const columnsBase: ColumnsType<InscricaoProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao' },
    { title: 'Nome da formação', dataIndex: 'nomeFormacao' },
    { title: 'Data/hora da Inscrição', dataIndex: 'dataInscricao' },
    { title: 'Turma', dataIndex: 'nomeTurma' },
    { title: 'Período', dataIndex: 'datas' },
    {
      title: 'Cargo/Função',
      dataIndex: 'cargoFuncao',
      render: (_, record) => (
        <Row justify="space-between">
          <>
            {record.cargoFuncao}
            {record.cargoFuncao && (
              <ModalEditCargoFuncaoButton record={record} />
            )}
          </>
        </Row>
      ),
    },
    { title: 'Situação', dataIndex: 'situacao' },
  ];


  // ================================
  // ABA EM ANDAMENTO (TEM AÇÕES)
  // ================================
  const columnsAndamento: ColumnsType<InscricaoProps> = [
    ...columnsBase,
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      render: (_, record) => {
        const cancelar = async () => {
          confirmacao({
            content: mensagemConfirmacao(record),
            onOk: async () => {
              const response = await cancelarInscricao(record.id);

              if (response.sucesso) {
                notification.success({
                  message: 'Sucesso',
                  description: 'Inscrição cancelada com sucesso!',
                });

                tableState.reloadData();
              }
            },
          });
        };

        return (
          <Button
            size="small"
            disabled={!record.podeCancelar}
            onClick={cancelar}
          >
            Cancelar inscrição
          </Button>
        );
      },
    },
  ];


  // ================================
  // ABA FINALIZADAS (SEM AÇÕES)
  // + Origem
  // + Situação da Aprovação (fixo)
  // ================================
  const columnsFinalizadas: ColumnsType<InscricaoProps> = [
    ...columnsBase,
    {
      title: 'Origem',
      dataIndex: 'origem',
      render: (value) => value || '-',
    },
    {
      title: 'Situação da Aprovação',
      dataIndex: 'situacaoAprovacao',
      render: () => 'Oculto',
    },
  ];

  const renderFiltros = () => (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={handleFiltroChange}
    >
      <Space wrap>
        {abaAtiva === 'andamento' && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              
              {/* Primeira linha */}
              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="CodigoFormacao"
                  label={<strong>Código da formação</strong>}
                >
                  <Input />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="NomeFormacao"
                  label={<strong>Nome da formação</strong>}
                >
                  <Input />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="DataInscricao"
                  label={<strong>Data da inscrição</strong>}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    locale={ptBR}
                  />
                </Form.Item>
              </div>

              {/* Segunda linha */}
              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="NomeTurma"
                  label={<strong>Turma</strong>}
                >
                  <Input />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="periodo"
                  label={<strong>Período de realização da formação</strong>}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    locale={ptBR}
                    allowEmpty={[true, true]}
                  />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(33.333% - 16px)" }}>
                <Form.Item
                  name="Situacao"
                  label={<strong>Situação</strong>}
                >
                  <Select
                    options={situacoesOptions}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

            </div>
          </>
        )}

        {abaAtiva === 'finalizadas' && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>

              <div style={{ flex: "0 0 calc(50% - 16px)" }}>
                <Form.Item
                  name="NomeFormacao"
                  label={<strong>Nome da formação</strong>}
                >
                  <Input />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(50% - 16px)" }}>
                <Form.Item
                  name="SituacaoInscricao"
                  label={<strong>Situação da inscrição</strong>}
                >
                  <Select
                    options={situacoesOptions}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(50% - 16px)" }}>
                <Form.Item
                  name="SituacaoAprovacao"
                  label={<strong>Situação de aprovação</strong>}
                >
                  <Select
                    options={situacaoAprovacaoOptions}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <div style={{ flex: "0 0 calc(50% - 16px)" }}>
                <Form.Item
                  name="periodo"
                  label={<strong>Período da formação</strong>}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    locale={ptBR}
                    allowEmpty={[true, true]}
                  />
                </Form.Item>
              </div>

            </div>
          </>
        )}
      </Space>
    </Form>
  );

  return (
    <Tabs
      activeKey={abaAtiva}
      onChange={(key) => {
        setAbaAtiva(key as any);
        form.resetFields();
        setFiltros({});
      }}
        items={[
        {
          key: 'andamento',
          label: 'Formações em andamento',
          children: (
            <>
              {renderFiltros()}
              <DataTable
                url={url}
                columns={columnsAndamento}
              />
            </>
          ),
        },
        {
          key: 'finalizadas',
          label: 'Formações finalizadas',
          children: (
            <>
              {renderFiltros()}
              <DataTable
                url={url}
                columns={columnsFinalizadas}
              />
            </>
          ),
        },
      ]}
    />
  );
};