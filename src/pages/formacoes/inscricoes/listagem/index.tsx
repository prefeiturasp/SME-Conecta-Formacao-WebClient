import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext } from 'react';
import { LuPartyPopper } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '~/components/lib/button/primary';
import DataTable from '~/components/lib/card-table';
import { notification } from '~/components/lib/notification';
import { CF_BUTTON_SORTEAR } from '~/core/constants/ids/button/intex';
import { INSCRICAO_CONFIRMA_SORTEIO } from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { confirmacao } from '~/core/services/alerta-service';
import { sortearInscricao } from '~/core/services/inscricao-service';
import { FiltroInscricoesProps } from '..';
import { DataTableContext } from '~/components/lib/card-table/provider';

interface InscricoesListaPaginadaProps {
  filters?: FiltroInscricoesProps;
  realizouFiltro?: boolean;
}

interface InscricoesProps {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  turmas: TurmasProps[];
}

interface TurmasProps {
  propostaTurmaId: number;
  nomeTurma: string;
  data: string;
  quantidadeVagas: number;
  quantidadeInscricoes: number;
  quantidadeConfirmada: number;
  quantidadeAguardandoAnalise: number;
  quantidadeEmEspera: number;
  quantidadeCancelada: number;
  quantidadeDisponivel: number;
  quantidadeExcedida: number;
  permissao: TurmasPermissaoProps;
}

interface TurmasPermissaoProps {
  podeRealizarSorteio: boolean;
}

export const InscricoesListaPaginada: React.FC<InscricoesListaPaginadaProps> = ({
  filters,
  realizouFiltro,
}) => {
  const { tableState } = useContext(DataTableContext);

  const navigate = useNavigate();

  const columns: ColumnsType<InscricoesProps> = [
    { title: 'Código da formação', dataIndex: 'codigoFormacao' },
    { title: 'Nome da formação', dataIndex: 'nomeFormacao' },
  ];

  const onClickEditar = (row: InscricoesProps) =>
    navigate(`${ROUTES.FORMACAOES_INSCRICOES}/editar/${row.id}`, { replace: true, state: row });

  const onClickSortear = (propostaTurmaId: number) => {
    confirmacao({
      content: INSCRICAO_CONFIRMA_SORTEIO,
      onOk() {
        sortearInscricao(propostaTurmaId).then((response) => {
          if (response.sucesso) {
            notification.success({
              message: response?.dados?.mensagem,
              description: 'Registro sorteado com sucesso',
            });
            tableState.reloadData();
          }
        });
      },
    });
  };

  const expandedRowRender = (record: InscricoesProps) => {
    const columns: ColumnsType<TurmasProps> = [
      { title: 'id', dataIndex: 'propostaTurmaId' },
      { title: 'Turma', dataIndex: 'nomeTurma' },
      { title: 'Data', dataIndex: 'data' },
      {
        title: 'Vagas',
        dataIndex: 'quantidadeVagas',
        render: (quantidadeVagas: number) => (
          <Tag>
            <Typography.Text strong>{quantidadeVagas || 0}</Typography.Text>
          </Tag>
        ),
      },

      {
        title: (
          <Typography.Text strong type='warning'>
            Inscrições
          </Typography.Text>
        ),
        dataIndex: 'quantidadeInscricoes',
        render: (quantidadeInscricoes: number) => (
          <Tag color='warning'>
            <Typography.Text strong type='warning'>
              {quantidadeInscricoes || 0}
            </Typography.Text>
          </Tag>
        ),
      },

      { title: 'Aguardando análise', dataIndex: 'quantidadeAguardandoAnalise' },
      { title: 'Em espera', dataIndex: 'quantidadeEmEspera' },
      { title: 'Confirmadas', dataIndex: 'quantidadeConfirmada' },
      { title: 'Canceladas', dataIndex: 'quantidadeCancelada' },
      { title: 'Vagas disponíveis', dataIndex: 'quantidadeDisponivel' },
      {
        title: <Typography.Text type='danger'>Vagas excedidas</Typography.Text>,
        dataIndex: 'quantidadeExcedida',
        render: (quantidadeExcedida: number) => (
          <Tag color='error'>
            <Typography.Text type='danger' strong>
              {quantidadeExcedida || 0}
            </Typography.Text>
          </Tag>
        ),
      },
      {
        title: 'Ações',
        align: 'center',
        width: '165px',
        render: (_, record) => (
          <ButtonPrimary
            id={CF_BUTTON_SORTEAR}
            icon={<LuPartyPopper size={20} />}
            disabled={!record?.permissao?.podeRealizarSorteio}
            onClick={() => onClickSortear(record.propostaTurmaId)}
          >
            Sortear inscrições
          </ButtonPrimary>
        ),
      },
    ];

    return <DataTable id='EXPANDED_DATA_TABLE' dataSource={record.turmas} columns={columns} />;
  };

  return (
    <DataTable
      url='v1/Inscricao/formacao-turmas'
      filters={filters}
      realizouFiltro={realizouFiltro}
      columns={columns}
      expandable={{
        expandedRowRender,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <UpOutlined
              onClick={(e) => {
                onExpand(record, e);
                e.stopPropagation();
              }}
            />
          ) : (
            <DownOutlined
              onClick={(e) => {
                onExpand(record, e);
                e.stopPropagation();
              }}
            />
          ),
      }}
      onRow={(row) => ({
        onClick: () => {
          onClickEditar(row);
        },
      })}
    />
  );
};
