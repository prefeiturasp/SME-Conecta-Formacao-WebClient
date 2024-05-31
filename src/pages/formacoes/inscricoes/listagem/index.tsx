import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { ROUTES } from '~/core/enum/routes-enum';
import { FiltroInscricoesProps } from '..';
import { Button } from 'antd';
import { CF_BUTTON_SORTEAR } from '~/core/constants/ids/button/intex';
import { INSCRICAO_CONFIRMA_SORTEIO } from '~/core/constants/mensagens';
import { confirmacao } from '~/core/services/alerta-service';
import { sortearInscricao } from '~/core/services/inscricao-service';
import { notification } from '~/components/lib/notification';

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
              description: 'Registro excluído com sucesso',
            });
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
      { title: 'Vagas', dataIndex: 'quantidadeVagas' },
      { title: 'Inscrições', dataIndex: 'quantidadeInscricoes' },
      { title: 'Aguardando análise', dataIndex: 'quantidadeAguardandoAnalise' },
      { title: 'Em espera', dataIndex: 'quantidadeEmEspera' },
      { title: 'Confirmadas', dataIndex: 'quantidadeConfirmada' },
      { title: 'Canceladas', dataIndex: 'quantidadeCancelada' },
      { title: 'Vagas disponíveis', dataIndex: 'quantidadeDisponivel' },
      { title: 'Vagas excedidas', dataIndex: 'quantidadeExcedida' },
      {
        title: 'Ações',
        align: 'center',
        width: '165px',
        render: (_, record) => (
          <>
            <Button
              block
              type='primary'
              onClick={() => onClickSortear(record.propostaTurmaId)}
              id={CF_BUTTON_SORTEAR}
              disabled={!record.permissao.podeRealizarSorteio}
            >
              Sortear inscrições
            </Button>
          </>
        ),
      },
    ];

    return (
      <DataTable
        dataSource={record.turmas}
        columns={columns}
        alterarRealizouFiltro={() => {
          () => {
            ('');
          };
        }}
      />
    );
  };

  return (
    <DataTable
      url='v1/Inscricao/formacao-turmas'
      filters={filters}
      realizouFiltro={realizouFiltro}
      alterarRealizouFiltro={() => {
        () => {
          ('');
        };
      }}
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
