import { Button, Row, Tabs, Form, Input, Select, DatePicker, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext, useState } from 'react';
import DataTable from '~/components/lib/card-table';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { notification } from '~/components/lib/notification';
import {
  CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO,
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA,
  DESEJA_CANCELAR_INSCRICAO_CURSISTA,
} from '~/core/constants/mensagens';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { URL_INSCRICAO, cancelarInscricao } from '~/core/services/inscricao-service';
import ModalEditCargoFuncaoButton from '../components/modal-edit-cargo-funcao/modal-edit-cargo-funcao-button';

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
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const [abaAtiva, setAbaAtiva] = useState<'andamento' | 'finalizadas'>('andamento');

  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const mensagemConfirmacao = (record: InscricaoProps) => {
    if (record.integrarNoSga && record.iniciado && ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_CURSISTA;
    } else if (record.integrarNoSga && record.iniciado && !ehCursista) {
      return DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA;
    } else if (!record.integrarNoSga && !record.iniciado && !ehCursista) {
      return CANCELAR_INSCRICAO;
    } else {
      return DESEJA_CANCELAR_INSCRICAO;
    }
  };
  
  
  const columns: ColumnsType<InscricaoProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao', width: '7%' },
    { title: 'Título da formação', dataIndex: 'nomeFormacao', width: '30%' },
    { title: 'Data/hora da inscrição', dataIndex: 'dataInscricao', width: '8%' },
    { title: 'Turma', dataIndex: 'nomeTurma', width: '12%' },
    { title: 'Período', dataIndex: 'datas', width: '10%' },
    {
      title: 'Cargo/Função',
      dataIndex: 'cargoFuncao',
      width: '15%',
      render: (_, record: InscricaoProps) => {
        return (
          <Row align='middle' justify='space-between'>
            <>
              {record.cargoFuncao}
              {record.cargoFuncao ? (
                <ModalEditCargoFuncaoButton record={record}></ModalEditCargoFuncaoButton>
              ) : (
                ''
              )}
            </>
          </Row>
        );
      },
    },
    { title: 'Origem', dataIndex: 'origem', width: '8%' },
    { title: 'Situação', dataIndex: 'situacao', width: '8%' },
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      width: '2%',
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
          <div style={{ display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
            <Button type='default' size='small' disabled={!record.podeCancelar} onClick={cancelar}>
              Cancelar inscrição
            </Button>
          </div>
        );
      },
    },
  ];


  const renderFiltros = () => {
    if (abaAtiva === 'finalizadas') {
      return (
        <Form layout="vertical">
          <Space wrap>
            <Form.Item label="Nome da formação">
              <Input />
            </Form.Item>
            <Form.Item label="Situação da inscrição">
              <Select style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="Situação da aprovação">
              <Select style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="Período da formação">
              <RangePicker />
            </Form.Item>
          </Space>
        </Form>
      );
    }

    return (
      <Form layout="vertical">
        <Space wrap>
          <Form.Item label="Código da formação">
            <Input />
          </Form.Item>
          <Form.Item label="Nome da formação">
            <Input />
          </Form.Item>
          <Form.Item label="Data da inscrição">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Turma">
            <Input />
          </Form.Item>
          <Form.Item label="Período">
            <RangePicker />
          </Form.Item>

          {/* Filtro oculto para uso futuro */}
          <Form.Item name="situacao" hidden>
            <Select />
          </Form.Item>
        </Space>
      </Form>
    );
  };

  return (
    <Tabs
      activeKey={abaAtiva}
      onChange={(key) =>
        setAbaAtiva(key as 'andamento' | 'finalizadas')
      }
      items={[
        {
          key: 'andamento',
          label: 'Formações em andamento',
          children: (
            <>
              {renderFiltros()}
              <DataTable
                url={`${URL_INSCRICAO}/proximas`}
                columns={columns}
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
                url={`${URL_INSCRICAO}/finalizadas`}
                columns={columns}
              />
            </>
          ),
        },
      ]}
    />
  );
};