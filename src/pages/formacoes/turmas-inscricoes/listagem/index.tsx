import { Button, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { DataTableContext } from '~/components/lib/card-table/provider';
import { CANCELAR_INSCRICAO } from '~/core/constants/mensagens';
import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';
import { confirmacao } from '~/core/services/alerta-service';
import { cancelarInscricao } from '~/core/services/inscricao-service';
import { FiltroTurmaInscricoesProps } from '..';

interface TurmasInscricoesListaPaginadaProps {
  filters?: FiltroTurmaInscricoesProps;
}

export interface TurmaInscricaoProps {
  nomeTurma: string;
  registroFuncional: string;
  inscricaoId: number;
  cpf: string;
  nomeCursista: string;
  cargoFuncao: string;
  situacao: string;
  podeCancelar?: boolean;
}

export const TurmasInscricoesListaPaginada: React.FC<TurmasInscricoesListaPaginadaProps> = ({
  filters,
}) => {
  const params = useParams();
  const id = params.id;
  const { tableState } = useContext(DataTableContext);

  const columns: ColumnsType<TurmaInscricaoProps> = [
    { title: 'Turma', dataIndex: 'nomeTurma' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Situação', dataIndex: 'situacao' },
    { title: 'RF', dataIndex: 'registroFuncional' },
    { title: 'Nome do cursista', dataIndex: 'nomeCursista' },
    { title: 'Cargo/Função Atividade', dataIndex: 'cargoFuncao' },
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      render: (_, record) => {
        const cancelar = async () => {
          confirmacao({
            content: CANCELAR_INSCRICAO,
            onOk: async () => {
              const response = await cancelarInscricao(record.inscricaoId);
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
            type='default'
            size='small'
            disabled={record.situacao === SituacaoInscricaoTagDisplay[SituacaoInscricao.Cancelada]}
            onClick={cancelar}
          >
            Cancelar inscrição
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      url={`v1/Inscricao/${id}`}
      rowKey='registroFuncional'
      columns={columns}
      filters={filters}
    />
  );
};
