import {
  Button,
  Col,
  Empty,
  Row,
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import ptBR from 'antd/es/date-picker/locale/pt_BR';
import 'dayjs/locale/pt-br';
import { ROUTES } from '~/core/enum/routes-enum';

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

type AbaType = 'andamento' | 'finalizadas';

export const MinhasInscricoesListaPaginada = () => {
  const { tableState } = useContext(DataTableContext);
  const navigate = useNavigate();

  const perfilSelecionado = useAppSelector(
    (store) => store.perfil.perfilSelecionado?.perfilNome,
  );

  const ehCursista =
    perfilSelecionado ===
    TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const [form] = Form.useForm();
  const [abaAtiva, setAbaAtiva] = useState<AbaType>('andamento');
  const [filtros, setFiltros] = useState<Record<string, any>>({});

  const emptyState = (
    <Empty
      style={{ padding: '48px 0' }}
      description={
        <span>
          Você não está inscrito em nenhuma formação no momento.
          <br />
          Explore as formações disponíveis clicando no botão abaixo.
        </span>
      }
    >
      <Button
        type="primary"
        onClick={() => navigate(ROUTES.AREA_PUBLICA)}
        style={{ backgroundColor: '#FF9A52', borderColor: '#FF9A52' }}
      >
        Explorar formações disponíveis
      </Button>
    </Empty>
  );

  const mensagemConfirmacao = (record: InscricaoProps) => {
    if (record.integrarNoSga && record.iniciado && ehCursista)
      return DESEJA_CANCELAR_INSCRICAO_CURSISTA;

    if (record.integrarNoSga && record.iniciado && !ehCursista)
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;

    if (!record.integrarNoSga && !record.iniciado && !ehCursista)
      return CANCELAR_INSCRICAO;

    return DESEJA_CANCELAR_INSCRICAO;
  };

  const handleCancelar = useCallback(
    async (record: InscricaoProps) => {
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
    },
    [tableState],
  );

  const handleFiltroChange = (_: any, allValues: any) => {
    const novosFiltros: Record<string, any> = { ...allValues };

    if (allValues.periodo) {
      novosFiltros.DataInicial = allValues.periodo[0]
        ? dayjs(allValues.periodo[0]).format('YYYY-MM-DD')
        : undefined;

      novosFiltros.DataFinal = allValues.periodo[1]
        ? dayjs(allValues.periodo[1]).format('YYYY-MM-DD')
        : undefined;
    }

    if (allValues.DataInscricao) {
      novosFiltros.DataInscricao = dayjs(
        allValues.DataInscricao,
      ).format('YYYY-MM-DD');
    }

    delete novosFiltros.periodo;

    setFiltros(novosFiltros);
  };

  const url = useMemo(() => {
    const base =
      abaAtiva === 'andamento'
        ? `${URL_INSCRICAO}/proximas`
        : `${URL_INSCRICAO}/finalizadas`;

    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const query = params.toString();
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

  /* const situacaoAprovacaoOptions = [
    { label: 'Aprovado', value: 1 },
    { label: 'Reprovado', value: 2 },
    { label: 'Não inscrito', value: 3 },
  ]; */

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
        <>
          {record.cargoFuncao}
          {record.cargoFuncao && (
            <ModalEditCargoFuncaoButton record={record} />
          )}
        </>
      ),
    },
    { title: 'Situação', dataIndex: 'situacao' },
  ];

  const columnsAndamento: ColumnsType<InscricaoProps> = [
    ...columnsBase,
    {
      title: 'Ações',
      render: (_, record) => (
        <Button
          size="small"
          disabled={!record.podeCancelar}
          onClick={() => handleCancelar(record)}
        >
          Cancelar inscrição
        </Button>
      ),
    },
  ];

  const columnsFinalizadas: ColumnsType<InscricaoProps> = [
    ...columnsBase,
    {
      title: 'Origem',
      dataIndex: 'origem',
      render: (value) => value || '-',
    },
    // {
    //   title: 'Situação da Aprovação',
    //   dataIndex: 'situacaoAprovacao',
    //   render: () => 'Oculto',
    // },
  ];

  const renderFiltros = () => (
    <Form
      layout="vertical"
      form={form}
      onValuesChange={handleFiltroChange}
    >
      <Row gutter={[16, 16]}>
        {abaAtiva === 'andamento' && (
          <>
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="CodigoFormacao" label="Código da formação" labelCol={{ style: { fontWeight: 600 } }}>
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item name="NomeFormacao" label="Nome da formação" labelCol={{ style: { fontWeight: 600 } }}>
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item name="DataInscricao" label="Data da inscrição" labelCol={{ style: { fontWeight: 600 } }}>
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  locale={ptBR}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item name="NomeTurma" label="Turma" labelCol={{ style: { fontWeight: 600 } }}>
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item
                name="periodo"
                label="Período de realização da formação"
                labelCol={{ style: { fontWeight: 600 } }}>
                <RangePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  locale={ptBR}
                  allowEmpty={[true, true]}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item name="Situacao" label="Situação" labelCol={{ style: { fontWeight: 600 } }}>
                <Select options={situacoesOptions}
                  allowClear />
              </Form.Item>
            </Col>
          </>
        )}

        {abaAtiva === 'finalizadas' && (
          <>
            <Col xs={24} md={12}>
              <Form.Item name="NomeFormacao" label="Nome da formação" labelCol={{ style: { fontWeight: 600 } }}>
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="SituacaoInscricao"
                label="Situação da inscrição"
                labelCol={{ style: { fontWeight: 600 } }}>
                <Select options={situacoesOptions} 
                  allowClear />
              </Form.Item>
            </Col>
{/* 
            <Col xs={24} md={12}>
              <Form.Item
                name="SituacaoAprovacao"
                label="Situação de aprovação"
                labelCol={{ style: { fontWeight: 600 } }}>
                <Select options={situacaoAprovacaoOptions} />
              </Form.Item>
            </Col> */}

            <Col xs={24} md={12}>
              <Form.Item name="periodo" label="Período da formação" labelCol={{ style: { fontWeight: 600 } }}>
                <RangePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  locale={ptBR}
                  allowEmpty={[true, true]}
                  allowClear
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
      
  return (
  <>
    <style>
      {`
        .abas-inscricoes .ant-tabs-nav {
          width: 100%;
        }

        .abas-inscricoes .ant-tabs-nav-list {
          width: 100%;
          display: flex;
        }

        .abas-inscricoes .ant-tabs-tab {
          flex: 1; 
          display: flex;
          justify-content: flex-start; 
        }

        .abas-inscricoes .ant-tabs-tab-btn {
          width: 100%;
          text-align: left;
          padding-left: 16px; 
          font-weight: 500;
        }

        .abas-inscricoes .ant-tabs-tab-active .ant-tabs-tab-btn {
          font-weight: 600;
        }

        .abas-inscricoes .ant-tabs-nav-wrap {
          width: 100%;
        }

        .tabs-mensagem {
          margin-top: 16px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #555;
        }

        .tabs-linha {
          width: 100%;
          height: 1px;
          background-color: #d9d9d9;
          margin-bottom: 16px;
        }
      `}
    </style>

    <Tabs
      className="abas-inscricoes"
      type="card"
      activeKey={abaAtiva}
      onChange={(key) => {
        setAbaAtiva(key as AbaType);
        form.resetFields();
        setFiltros({});
      }}
      items={[
        {
          key: 'andamento',
          label: 'Formações em andamento',
          children: (
            <>
              <div className="tabs-mensagem">
                Confira aqui todas as formações em que você se inscreveu. Use as abas para acessar os cursos que ainda vão acontecer e aqueles que já foram concluídos.
              </div>

              <div className="tabs-linha" style={{ margin: '35px 0' }} />

              {renderFiltros()}

              <DataTable
                url={url}
                columns={columnsAndamento}
                locale={{ emptyText: emptyState }}
                hideHeaderOnEmpty
              />
            </>
          ),
        },
        {
          key: 'finalizadas',
          label: 'Formações finalizadas',
          children: (
            <>
              <div className="tabs-mensagem">
                Confira aqui todas as formações em que você se inscreveu. Use as abas para acessar os cursos que ainda vão acontecer e aqueles que já foram concluídos.
              </div>

              <div className="tabs-linha" style={{ margin: '35px 0' }} />

              {renderFiltros()}

              <DataTable
                url={url}
                columns={columnsFinalizadas}
                locale={{ emptyText: emptyState }}
                hideHeaderOnEmpty
              />
            </>
          ),
        },
      ]}
    />
  </>
  );
};